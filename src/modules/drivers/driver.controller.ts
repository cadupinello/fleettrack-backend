import { Request, Response } from 'express';
import { driverService } from './driver.service';

export const driverController = {
  create: async (req: Request, res: Response) => {
    try {
      const driver = await driverService.create(req.body)
      return res.status(201).json(driver)
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: 'Erro ao criar motorista' })
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const drivers = await driverService.findAll();
      return res.status(200).json(drivers);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Erro ao buscar motoristas" });
    }
  },
};