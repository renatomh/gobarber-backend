/* Definindo os tipos de dados para a criação de um appointment */
export default interface ICreateAppointmentDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}
