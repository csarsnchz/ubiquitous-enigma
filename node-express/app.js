const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerOption = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Items REST API',
            version: '0.0.1',
            description: 'Restful API for Items Management',
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
              },
        },
        basePath: '/items',
        servers: [{ 
          url: 'https://potential-halibut-qvjpvjggqv6hpww-3000.app.github.dev/',
          description: 'Development Server' }]
    },
    apis: ['app.js'],
  };

const swaggerSpec = swaggerJsDoc(swaggerOption);


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.send('Welcome to our REST API');
});

app.listen(port, ()=>{
    console.log('Server started at port:'+port);
});

/**
* @swagger
* components:
*   schemas:
*      Item: 
*         type: object
*         properties: 
*            id:
*              type: integer
*              description: item id
*            name:
*              type: string
*              description: item name
*            description: 
*               type: string
*               description: item description
*         required:
*           - id
*           - name
*           - description
*         example:
*            name: 5
*            item: Item 5
*            description: Item 5 Desc
*/

let items = [
    { id: 1, name: 'Item 1', description: 'This is item 1.' },
    { id:2, name: 'Item 2', description: 'This is item 2.' },
    { id: 3, name: 'Item 3', description: 'This is item 3.' },
    { id: 4, name:  'Item 4', description: 'This is item 4.'}
  ];

/**
 * @swagger
 * /items:
 *  get:
 *    summary: list all items
 *    tags: [Item]
 *    requestBody:
 *      required: false
 *    responses:
 *      200:
 *        description: list items successful
 *        content:
 *            application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                    $ref: '#/components/schemas/Item'
 */
  app.get('/items', (req, res) => {
    res.json(items);
  });

 /**
 * @swagger
 * /items/{id}:
 *  get:
 *    summary: find items by id
 *    tags: [Item]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *          type: integer
 *       required: true
 *       description: ID of item
 *    responses:
 *      200:
 *        description: list items successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Item'
 *      404:
 *        description: item not found
 */
  app.get('/items/:id', (req,res) => {
    const itemId = parseInt(req.params.id);
    const item = items.find((item) => item.id === itemId);

    if (!item){
        res.status(404).json({ message: 'Item not found.' });
    }

    res.json(item);
  });
  
 /**
 * @swagger
 * /items:
 *  post:
 *    summary: find items by id
 *    tags: [Item]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *          type: integer
 *       required: true
 *       description: ID of item
 *    responses:
 *      200:
 *        description: list items successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Item'
 *      404:
 *        description: item not found
 */
  app.post('/items', (req, res) => {
    const newItem = {
      id: items.length + 1,
      name: req.body.name,
      description: req.body.description,
    };
  
    items.push(newItem);
    res.status(201).json(newItem);
  });
  
  /**
 * @swagger
 * /items/{id}:
 *  put:
 *    summary: update items by id
 *    tags: [Item]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *          type: integer
 *       required: true
 *       description: ID of item to update
 *    responses:
 *      200:
 *        description: list items successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Item'
 *      404:
 *        description: item not found
 */
  app.put('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const itemIndex = items.findIndex((item) => item.id === itemId);
  
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found.' });
    }
  
    items[itemIndex] = {
      id: itemId,
      name: req.body.name,
      description: req.body.description,
    };
  
    res.json(items[itemIndex]);
  });
  
  /**
 * @swagger
 * /items/{id}:
 *  delete:
 *    summary: delete items by id
 *    tags: [Item]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *          type: integer
 *       required: true
 *       description: ID of item to delete
 *    responses:
 *      204:
 *        description: Item delete successful
 *      404:
 *        description: item not found
 */
  app.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const itemIndex = items.findIndex((item) => item.id === itemId);
  
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found.' });
    }
  
    items.splice(itemIndex, 1);
    res.status(204).send();
  });