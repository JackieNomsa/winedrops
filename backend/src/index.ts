import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import "./database.ts"
import { processOrders } from "./database";
import cors from '@fastify/cors';

(async () => {
  const fastify = Fastify({
    logger: true
  });

  fastify.register(cors, {
    origin: '*' 
});


  fastify.get("/",{
    handler: async (request: FastifyRequest, response: FastifyReply) => {
    return {hello: "world"}
  }})


  fastify.get('/best_selling_wines', async (request, reply) => {
    try {
      return await processOrders();
  } catch (err) {
      reply.status(500).send({ error: 'Failed to fetch customer orders' });
  }
  });

  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
  }
})();

