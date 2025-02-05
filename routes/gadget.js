import express from "express";
import { getGadgets, postGadgets, patchGadgets, deleteGadgets, triggerSelfDestruct } from "../controller/gadgets.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gadgets
 *   description: API for managing gadgets
 */

/**
 * @swagger
 * /gadgets:
 *   get:
 *     summary: Get all gadgets
 *     description: Fetches all gadgets from the database
 *     tags: [Gadgets]
 *     responses:
 *       200:
 *         description: Successfully fetched gadgets
 */
router.get("/", getGadgets);

/**
 * @swagger
 * /gadgets:
 *   post:
 *     summary: Create a new gadget
 *     tags: [Gadgets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Invisibility Cloak"
 *     responses:
 *       200:
 *         description: Successfully created a gadget
 */
router.post("/", postGadgets);

/**
 * @swagger
 * /gadgets/{id}:
 *   patch:
 *     summary: Update a gadget
 *     tags: [Gadgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Gadget"
 *               status:
 *                 type: string
 *                 example: "ACTIVE"
 *     responses:
 *       200:
 *         description: Successfully updated the gadget
 */
router.patch("/:id", patchGadgets);

/**
 * @swagger
 * /gadgets/{id}:
 *   delete:
 *     summary: Decommission a gadget
 *     tags: [Gadgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully decommissioned the gadget
 */
router.delete("/:id", deleteGadgets);

/**
 * @swagger
 * /gadgets/{id}/self-destruct:
 *   post:
 *     summary: Trigger self-destruct for a gadget
 *     description: Initiates the self-destruct sequence for a gadget, changing its status to 'DESTROYED' and providing a confirmation code.
 *     tags: [Gadgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the gadget to be self-destructed.
 *     responses:
 *       200:
 *         description: Self-destruct sequence triggered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Self-destruct sequence triggered for gadget: The Phoenix and Confirmation code: 456123"
 *                 confirmationCode:
 *                   type: string
 *                   example: "ABC123"
 *                 updatedGadget:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     name:
 *                       type: string
 *                       example: "Invisibility Cloak"
 *                     codename:
 *                       type: string
 *                       example: "The Phoenix"
 *                     status:
 *                       type: string
 *                       example: "DESTROYED"
 *                     destroyedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-02-03T12:34:56.789Z"
 *       500:
 *         description: Something went wrong on the server.
 */
router.post("/:id/self-destruct", triggerSelfDestruct);

export default router;
