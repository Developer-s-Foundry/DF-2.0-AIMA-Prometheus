import { rabbitMqChannel } from "../config/rabbitmq.js";
import { logger } from "../config/logger.js";
import ProjectRepository from "../repositories/ProjectRepository.js";

export async function consumeProjectMessages() {
  const channel = await rabbitMqChannel();
  const queue = "projects_queue";

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const receivedMessage = msg.content.toString();
      const sentData = JSON.parse(msg.content);
      const { data, event_type } = sentData;
      if (!data) return;
      const projectRepository = new ProjectRepository()
      const {id, name, description, base_url, prometheus_metric_url, team_id, owner_id } = data;
      switch (event_type) {
        case "PROJECT_CREATED":
          await projectRepository.create({
            name,
            description,
            base_url,
            prometheus_metric_url,
            team_id,
            owner_id,
          });
          logger.info(`Project created`);
          break;

        case "PROJECT_UPDATED":
          await projectRepository.update({
            name,
            id,
            description,
            base_url,
            prometheus_metric_url,
            team_id,
            owner_id,
          });
          logger.info(`Project updated`);
          break;

        case "PROJECT_DELETED":
          await projectRepository.delete({
            id
          });
          logger.info(`Project created`);
          break;

        default:
          break;
      }

      logger.info(
          `Message successfully consumed from queue: ${queue} - Message: ${receivedMessage}`
        );

      channel.ack(msg);
    }
  });

}