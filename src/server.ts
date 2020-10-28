import './utils/moduleAlias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import * as database from '@src/database';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super(true);
  }

  async init(): Promise<void> {
    this.setupeExpress();
    this.setupeController();
    await this.databaseSetup();
  }

  private setupeExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupeController(): void {
    const forecast = new ForecastController();
    this.addControllers([forecast]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    // turn of database only
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }
}
