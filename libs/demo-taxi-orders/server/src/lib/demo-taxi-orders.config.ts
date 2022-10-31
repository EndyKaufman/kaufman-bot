export const DEMO_TAXI_ORDERS_CONFIG = Symbol('DEMO_TAXI_ORDERS_CONFIG');

export interface DemoTaxiOrdersConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  botName: { [langCode: string]: string };
  category: string;
}
