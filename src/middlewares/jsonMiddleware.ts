import express, { RequestHandler } from "express";

export const jsonMiddleware: RequestHandler = express.json();
