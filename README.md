# skohub-editor

The [SkoHub](https://skohub.io) editor will run in the browser and enable structured description of educational resources published anywhere on the web. It includes validation of the entered content for each field and lookup of controlled values via the API provided by [skohub-vocabs](https://github.com/hbz/skohub-vocabs). For usage & implementation details see the [blog post](https://blog.lobid.org/2020/03/31/skohub-editor.html).


## Set up
```
git clone https://github.com/skohub-io/skohub-editor.git
cd skohub-editor
npm install
```

### Run in development mode
```
PORT=9004 npm start
```
A development server will be running on [localhost:9004](http://localhost:9004).
Omiting `PORT` will start the server at port 9090.

### Build for production
```
npm run build
```
A new build will be at `dist/`

### Build and serve for production
```
PORT=9005 npm run serve
```
The content of the new build will be available on [localhost:9005](http://localhost:9005).
Omitting `PORT` will start the server at port 8080.

### start scripts
You may want to use the start scripts in `scripts/` to manage via init and to monitor them with `monit`.
