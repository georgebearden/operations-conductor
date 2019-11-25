/************************************************************************************
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.          *
 *                                                                                  *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of  *
 * this software and associated documentation files (the "Software"), to deal in    *
 * the Software without restriction, including without limitation the rights to     *
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of *
 * the Software, and to permit persons to whom the Software is furnished to do so.  *
 *                                                                                  *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR       *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS *
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR   *
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER   *
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN          *
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.       *
 ***********************************************************************************/

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import { factory } from '../logger';
import { Task } from './tasks';

export const configureApp = () => {
    // Logger
    const logger = factory.getLogger('tasks.App');

    // Declares a new express app
    const app = express();
    const router = express.Router();

    router.use(cors());
    router.use((req: any, res: any, next: any) => {
        bodyParser.json()(req, res, (err: any) => {
            if (err) {
                return res.status(400).json({
                    code: 400,
                    error: 'BadRequest',
                    message: err.message
                });
            }
            next();
        });
    });
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(awsServerlessExpressMiddleware.eventContext());

    // Declares Task class
    const task = new Task();

    // GET /tasks
    router.get('/tasks', async (req: any, res: any) => {
        logger.info('GET /tasks');
        try {
            const result = await task.getTasks();
            res.status(200).json(result);
        } catch (error) {
            logger.error(JSON.stringify(error));
            res.status(error.statusCode).json(error);
        }
    });

    // POST /tasks
    router.post('/tasks', async (req: any, res: any) => {
        logger.info('POST /tasks');
        const newTask = req.body;
        try {
            const result = await task.createTask(newTask);
            res.status(201).json(result);
        } catch (error) {
            logger.error(JSON.stringify(error));
            res.status(error.statusCode).json(error);
        }
    });

    // GET /tasks/{taskId}
    router.get('/tasks/:taskId', async (req: any, res: any) => {
        logger.info('GET /tasks/:taskId');
        const { taskId } = req.params;
        try {
            const result = await task.getTask(taskId);
            res.status(200).json(result);
        } catch (error) {
            logger.error(JSON.stringify(error));
            res.status(error.statusCode).json(error);
        }
    });

    // PUT /tasks/{taskId}
    router.put('/tasks/:taskId', async (req: any, res: any) => {
        logger.info('PUT /tasks/:taskId');
        const { taskId } = req.params;
        const updatedTask = req.body;
        try {
            const result = await task.editTask(taskId, updatedTask);
            res.status(200).json(result);
        } catch (error) {
            logger.error(JSON.stringify(error));
            res.status(error.statusCode).json(error);
        }
    });

    // DELETE /tasks/{taskId}
    router.delete('/tasks/:taskId', async (req: any, res: any) => {
        logger.info('DELETE /tasks/:taskId');
        const { taskId } = req.params;
        try {
            await task.deleteTask(taskId);
            res.sendStatus(204);
        } catch (error) {
            logger.error(JSON.stringify(error));
            res.status(error.statusCode).json(error);
        }
    });

    // PUT /tasks/{taskId}/execute
    router.put('/tasks/:taskId/execute', async (req: any, res: any) => {
        logger.info('PUT /tasks/:taskId/execute');
        const { taskId } = req.params;
        try {
            const result = await task.executeTask(taskId);
            res.status(200).json(result);
        } catch (error) {
            logger.error(JSON.stringify(error));
            res.status(error.statusCode).json(error);
        }
    });

    // POST /tasks/{taskId}/executions
    router.post('/tasks/:taskId/executions', async (req: any, res: any) => {
        logger.info('POST /tasks/:taskId/executions');
        const { taskId } = req.params;
        const { sortType, itemsPerPage, lastKey } = req.body;
        try {
            const result = await task.getTaskExecutions(taskId, sortType, itemsPerPage, lastKey);
            res.status(200).json(result);
        } catch (error) {
            logger.error(JSON.stringify(error));
            res.status(error.statusCode).json(error);
        }
    });

    // POST /tasks/{taskId}/executions/{parentExecutionId}
    router.post('/tasks/:taskId/executions/:parentExecutionId', async (req: any, res: any) => {
        logger.info('POST /tasks/:taskId/executions/:parentExecutionId');
        const { taskId, parentExecutionId } = req.params;
        const { itemsPerPage, lastKey } = req.body;
        try {
            const result = await task.getAutomationExecutions(taskId, parentExecutionId, itemsPerPage, lastKey);
            res.status(200).json(result);
        } catch (error) {
            logger.error(JSON.stringify(error));
            res.status(error.statusCode).json(error);
        }
    });

    // GET /tasks/{taskId}/executions/{parentExecutionId}/{automationExecutionId}
    router.get('/tasks/:taskId/executions/:parentExecutionId/:automationExecutionId', async (req: any, res: any) => {
        logger.info('GET /tasks/:taskId/executions/:parentExecutionId/:automationExecutionId');
        const { taskId, parentExecutionId, automationExecutionId } = req.params;
        try {
            const result = await task.getAutomationExecution(taskId, parentExecutionId, automationExecutionId);
            res.status(200).json(result);
        } catch (error) {
            logger.error(JSON.stringify(error));
            res.status(error.statusCode).json(error);
        }
    });

    app.use('/', router);

    return app;
};
