import './utils/moduleAlias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super(true);
  }

  public init(): void {
    this.setupeExpress();
    this.setupeController();
  }

  private setupeExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupeController(): void {
    const forecast = new ForecastController();
    this.addControllers([forecast]);
  }
  public getApp(): Application {
    return this.app;
  }
}
