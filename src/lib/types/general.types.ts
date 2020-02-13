export type RandomObject = {
  [props: string]: any;
};

export interface GenericObject {
  [props: string]: string | object | boolean | undefined;
}

export type CustomError = {
  statusCode?: number;
  error: string | object;
};
