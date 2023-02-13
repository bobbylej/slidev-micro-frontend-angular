---
theme: zhozhoba
layout: cover
company: Mateusz Adamczyk
date: 17.02.2023
---
<style>
  #app {
    .slidev-layout {
      &.section-1 {
        .block {
          max-width: 1000px;
        }
      }

      &.section-2 {
        .block {
          max-width: 1000px;
        }
      }

      &.content-1 {
        .block {
          max-width: 800px;
          @apply pl-20;
        }
      }

      &.content-2 {
        .block {
          max-width: 1000px;
          @apply pl-20;
        }
      }
    }
  }
</style>

# Micro Frontends in Angular
### Simple steps to generate Micro Frontend in Angular

---
layout: section-1
---

# Generate Micro Frontend

<br/>

## Add Module Federation
```shell
> npm i @angular-architects/module-federation -D 
```

<br/>
<br/>

## Generate HOST App

```shell {none|1|2|all}
> ng generate application hostApp # Generate app for host
> ng add @angular-architects/module-federation --project hostApp --type host --port 4200 # Generate config for host
```

<br/>
<br/>

## Generate REMOTE App

```shell {none|1|2|all}
> ng generate application remoteApp # Generate app for remote
> ng add @angular-architects/module-federation --project remoteApp --type remote --port 4201 # Generate config for remote
```

---
layout: content-1
---
# What it does?

```shell {none|1|2|3|4|all}
> ng add @angular-architects/module-federation 
  --project PROJECT_NAME # Name of the project in the workspace
  --type {host|dynamic-host|remote} # Type of the configuration
  --port PORT # Port for the app
```

<br/>
<br/>

- Install `ngx-build-plus` package for building app
- Create `webpack.config.js` and `webpack.config.prod.js` in selected project
- Modify `angular.json`

---
layout: section-2
---
<style>
#app .block {
  margin: 20px auto;

  p {
    margin: 0 auto;
    margin-bottom: 1rem;
  }
}

#code-comparison {
  display: flex;
  flex-direction: row;
  gap: 1rem;

  .slidev-code-wrapper {
    max-width: 450px;
  }
}
</style>

`webpack.config.js`

<div id="code-comparison">
<div>
Host
```js {none|4|5-10|13-19|all} {maxHeight:'450px'}
const { shareAll, withModuleFederationPlugin } = 
  require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  // Difference between `--type host` and `dynamic-host`:
  // `--type host` will generate `remotes` option
  // `--type dynamic-host` will generate `mf.manifest.json` file with the same loaded at runtime
  remotes: {
    "remoteApp": "http://localhost:4201/remoteEntry.js",    
  },

  shared: {
    ...shareAll({ 
      singleton: true, // One instace of the module
      strictVersion: true, // Reject module if not valid version
      requiredVersion: 'auto' // Required version of the module
      // Documentation and more options here: 
      // https://webpack.js.org/plugins/module-federation-plugin/#sharing-hints
    }),
  },
});
```
</div>
<div>
Remote
```js {none|4|5|7-12|14-19|all} {maxHeight:'450px'}
const { shareAll, withModuleFederationPlugin } = 
  require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'remoteApp',

  exposes: {
    // This seems to be wrong 
    './Component': './projects/remote-app/src/app/app.component.ts',
    // and should be changed to that:
    './Module': './projects/remote-app/src/app/app.module.ts',
  },

  shared: {
    ...shareAll({ 
      singleton: true, 
      strictVersion: true, 
      requiredVersion: 'auto' 
    }),
  },
});
```
</div>
</div>

---
layout: content-2
---

`angular.json`

```json {none|6|8|all} {maxHeight:'400px'}
{
	"projects": {
    "hostApp": {
      "architect": {
				"build": {
					"builder": "ngx-build-plus:browser",
          "options": {
            "extraWebpackConfig": "projects/host-app/webpack.config.js",
            "commonChunk": false
          },
        },
        "configurations": {
          "production": {
            "extraWebpackConfig": "projects/host-app/webpack.prod.config.js"
          },
        },
        "serve": {
					"builder": "ngx-build-plus:dev-server",
					"configurations": {
						"production": {
							"extraWebpackConfig": "projects/host-app/webpack.prod.config.js"
						},
					},
					"options": {
						"port": 4200,
						"publicHost": "http://localhost:4200",
						"extraWebpackConfig": "projects/host-app/webpack.config.js"
					}
				},
        "extract-i18n": {
					"builder": "ngx-build-plus:extract-i18n",
					"options": {
						"extraWebpackConfig": "projects/host-app/webpack.config.js"
					}
				},
      }
    }
  }
}
```

---
layout: section-1
---

# Host Routing

## `projects/hostApp/src/app/app-routing.module.ts`

```ts {none|all}
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('remoteApp/Module').then((m) => m.AppModule),
  },
];
```
<br/>

## `projects/hostApp/src/decl.d.ts`

```ts {none|all}
declare module 'remoteApp/Module';
```

---
layout: image-side
image: 'https://source.unsplash.com/collection/94734566/1920x1080'
---

# Unexpected behavior

<v-click>

### Problem

Root component of `remoteApp` is not visible in `hostApp`

</v-click>

<v-click>

###  Solution

Use `AppModule` for development and create inner module only with child components for export

</v-click>

---
layout: section-2
---

# Unexpected behavior - fix

Changes in `remoteApp`

<v-click>

```shell {none|1|2|all}
> ng generate module --project remoteApp --routing inner
> ng generate component --project remoteApp --module inner inner/first
```

</v-click>

<v-click>

## `projects/remoteApp/src/app/inner/inner-routing.module.ts`

```ts {none|2-5|8|all}
const routes: Routes = [
  {
    path: '',
    component: FirstComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)], // forChild is important here
  exports: [RouterModule]
})
export class InnerRoutingModule { }
```

</v-click>

---
layout: section-2
---

# Unexpected behavior - fix

Changes in `remoteApp`

<v-click>

## `projects/remoteApp/webpack.config.js`

```js {none|2-5}
module.exports = withModuleFederationPlugin({
  exposes: {
    // We won't need AppModule anymore
    // './Module': './projects/remote-app/src/app/app.module.ts',
    './InnerModule': './projects/remote-app/src/app/inner/inner.module.ts',
  },
});
```

</v-click>

<v-click>

## `projects/remoteApp/tsconfig.app.json`

```json {none|4}
{
  "files": [
    "src/main.ts",
    "src/app/inner/inner.module.ts"
  ],
}
```

</v-click>

---
layout: content-1
---

# Unexpected behavior - fix

Changes in `hostApp`

<v-click>

## `projects/hostApp/src/decl.d.ts`

```ts
// declare module 'remoteApp/Module';
declare module 'remoteApp/InnerModule';
```

</v-click>

<v-click>

## `projects/hostApp/src/app/app-routing.module.ts`

```ts {2-6}
const routes: Routes = [
  {
    path: '',
    // loadChildren: () => import('remoteApp/Module').then((m) => m.AppModule),
    loadChildren: () => import('remoteApp/InnerModule').then((m) => m.InnerModule),
  },
];
```

</v-click>

---
layout: content-2
---
# Dynamic Module Federation

## `projects/hostApp/src/decl.d.ts` - Can be removed

<br/>

## `projects/hostApp/src/app/app-routing.module.ts`

```ts {none|all}
  {
    path: '',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './InnerModule',
      }).then((m) => m.InnerModule),
  },
```

## `projects/hostApp/src/main.ts`

```ts {none|all}
Promise.all([
  loadRemoteEntry({
    type: 'module',
    remoteEntry: 'http://localhost:4201/remoteEntry.js',
  }),
]).catch((err) => console.error('Error loading remote entries', err))
  .then(() => import('./bootstrap'))
	.catch(err => console.error(err));
```

---
layout: section-1
---

# Generate Library

```shell
> ng generate library shared
```

## `tsconfig.json`

```json {none|all}
{
  "paths": {
    "shared": [
      "dist/shared"
    ]
  },
}
```

## [optional] `webpack.config.js` (in hostApp and remoteApp)

```js {none|5}
module.exports = withModuleFederationPlugin({
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
  sharedMappings: ['shared'] // without that all local libraries will be shared
});

```

---
layout: end
---

# Thanks!

<br/>
<br/>

### Next steps

- State managment with micro-frontend
- SSR with micro-frontend

<br/>
<br/>

### Links

- [Sample Micro Frontent App](https://github.com/bobbylej/angular-micro-frontend-sample)

- [https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/tutorial/tutorial.md)

- [https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/README.md](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/README.md)