import { requireAuth } from "@/middlewares/requireAuth";
import { requireAdmin } from "@/utils/asyncHandler";
import { Router } from "express";
import { driverController } from "./driver.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: refresh-token
 *   schemas:
 *     Driver:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "d3d9f9a0-5b5f-4b3a-8c1c-2e1b1b1b1b1b"
 *         name:
 *           type: string
 *           example: "João Silva"
 *         phone:
 *           type: string
 *           example: "(11) 99999-9999"
 *         licenseNumber:
 *           type: string
 *           example: "SP12345678"
 */

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Gerenciamento de motoristas
 */

/**
 * @swagger
 * /drivers:
 *   post:
 *     summary: Cria um novo motorista
 *     tags: [Drivers]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Driver'
 *           examples:
 *             Example:
 *               value:
 *                 name: "Maria Souza"
 *                 phone: "(11) 98765-4321"
 *                 licenseNumber: "SP76543210"
 *                 licenseType: "D"
 *                 licenseExpiry: "2026-12-31"
 *     responses:
 *       201:
 *         description: Motorista criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Acesso não autorizado (cookie inválido/ausente)
 *       403:
 *         description: Acesso negado (requer perfil de administrador)
 */
router.post("/", requireAuth, requireAdmin, driverController.create);

/**
 * @swagger
 * /drivers:
 *   get:
 *     summary: Lista todos os motoristas
 *     tags: [Drivers]
 *     responses:
 *       200:
 *         description: Lista de motoristas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Driver'
 */
router.get("/", driverController.getAll);

/**
 * @swagger
 * /drivers/{id}:
 *   get:
 *     summary: Obtém um motorista pelo ID
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         example: "d3d9f9a0-5b5f-4b3a-8c1c-2e1b1b1b1b1b"
 *     responses:
 *       200:
 *         description: Motorista encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       404:
 *         description: Motorista não encontrado
 */
router.get("/:id", driverController.getById);

/**
 * @swagger
 * /drivers/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um motorista
 *     tags: [Drivers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               licenseExpiry:
 *                 type: string
 *                 format: date
 *           examples:
 *             Atualização Parcial:
 *               value:
 *                 phone: "(11) 98888-7777"
 *     responses:
 *       200:
 *         description: Motorista atualizado
 *       401:
 *         description: Não autorizado (cookie inválido/ausente)
 *       403:
 *         description: Acesso negado (requer admin)
 *       404:
 *         description: Motorista não encontrado
 */
router.patch("/:id", requireAuth, requireAdmin, driverController.update);

/**
 * @swagger
 * /drivers/{id}:
 *   delete:
 *     summary: Remove um motorista
 *     tags: [Drivers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *     responses:
 *       204:
 *         description: Motorista removido com sucesso
 *       401:
 *         description: Não autorizado (cookie inválido/ausente)
 *       403:
 *         description: Acesso negado (requer admin)
 *       404:
 *         description: Motorista não encontrado
 */
router.delete("/:id", requireAuth, requireAdmin, driverController.delete);

export default router;
