import prisma from "../prisma/client.js";
import { generateConfirmationCode } from "../function/index.js";
import { generateSuccessProbability } from "../function/index.js";

const generateCodename = () => {
    const codenames = [
        "The Nightingale", "The Kraken", "The Falcon", "The Phantom", "The Viper", "The Cobra", "The Titan", "The Falcon", "The Shadow", "The Wolf", "The Phoenix", "The Dragon", "The Sphinx", "The Griffin", "The Hydra", "The Chimera", "The Wraith", "The Spectre", "The Leviathan", "The Manticore"
    ];
    const randomIndex = Math.floor(Math.random() * codenames.length);
    return codenames[randomIndex];
};

export const getGadgets = async (req, res) => {
    const { status } = req.query; 

    try {
        let gadgets;

        if (status) {
            gadgets = await prisma.gadget.findMany({
                where: {
                    status: status.toUpperCase(), 
                },
            });
        } else {
            gadgets = await prisma.gadget.findMany();
        }

        const gadgetsWithProbability = gadgets.map(gadget => {
            const probability = generateSuccessProbability();
            return {
                ...gadget,
                missionSuccessProbability: `${probability}%`,
                message: `${gadget.codename} - ${probability}% success probability.`,
            };
        });

        return res.status(200).json({ message: gadgetsWithProbability });
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong, Error: ${error.message}` });
    }
};

export const postGadgets = async (req, res) => {
    const { name } = req.body;
    const codename = generateCodename();

    try {
        const result = await prisma.gadget.create({
            data: {
                name: name,
                codename: codename,
            },
        });
        return res.status(200).json({result});
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong, Error: ${error.message}` });
    }
};

export const patchGadgets = async (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;

    try {
        const updatedGadget = await prisma.gadget.update({
            where: { id: id },
            data: {
                name: name,
                status: status,
            },
        });

        return res.status(200).json(updatedGadget);
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong, Error: ${error.message}` });
    }
};

export const deleteGadgets = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedGadget = await prisma.gadget.update({
            where: { id: id },
            data: {
                status: "DECOMMISSIONED",
                decommissionedAt: new Date(),
            },
        });

        return res.status(200).json(updatedGadget);
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong, Error: ${error.message}` });
    }
};

export const triggerSelfDestruct = async (req, res) => {
    const { id } = req.params; 

    try {
        const confirmationCode = generateConfirmationCode();

        const updatedGadget = await prisma.gadget.update({
            where: { id: id },
            data: {
                status: 'DESTROYED', 
                destroyedAt: new Date(), 
            },
        });

        return res.status(200).json({
            message: `Self-destruct sequence triggered for gadget: ${updatedGadget.codename} and Confirmation code: ${confirmationCode}`,
            confirmationCode: confirmationCode, 
            updatedGadget,
        });
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong, Error: ${error.message}` });
    }
};
