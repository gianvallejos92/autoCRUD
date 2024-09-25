import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import ObjectsRoutes from './routes/objects.routes.js';
import FieldsRoutes from './routes/fields.routes.js';
import RecordsRoutes from './routes/records.routes.js';
import AppsRoutes from './routes/apps.routes.js';

//Init
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//Settings
app.set('port', 5000);
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
  defaultLayout: 'main',
  layoutsDir: join(app.get('views'), 'layouts'),
  partialsDir: join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: {
    eq: (arg1, arg2) => {
      return (arg1 === arg2)
    }    
  }
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes
app.get('/', (req, res) => {
  res.render('index')
});

app.use(ObjectsRoutes);
app.use(FieldsRoutes);
app.use(RecordsRoutes);
app.use(AppsRoutes);

//Public Files
app.use(express.static(join(__dirname, 'public')));

//Run Server
app.listen(app.get('port'), () => 
  console.log('Server listening on port ', app.get('port'))
);