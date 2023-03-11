export interface ISlashCommand {
  name: string;
  description: string;
  execute: (interaction) => void;
}
