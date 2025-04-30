export type AxiosSearchParams = {
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | Array<string | number | boolean | undefined>;
};

export interface AxiosRequestOptions {
  headers?: Record<string, string>;
  params?: AxiosSearchParams;
  withCredentials?: boolean;
}
