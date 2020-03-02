# skohub-editor

The [SkoHub](https://skohub.io) editor will run in the browser and enable structured description of educational resources published anywhere on the web. It includes validation of the entered content for each field and lookup of controlled values via the API provided by [skohub-vocabs](https://github.com/hbz/skohub-vocabs).


## Set up
```
git clone https://github.com/hbz/skohub-editor.git
cd skohub-editor
npm install
```

### Run in development mode
```
npm start
```
A development server will be running on [localhost:8080](http://localhost:8080)

### Build for production
```
npm run build
```
A new build will be at `dist/`

### Build and serve for production
```
npm run serve
```
The content of the new build will be available on [localhost:8081](http://localhost:8081)

