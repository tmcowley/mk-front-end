import Demo from "../pages/Demo";

import {
  AxiosRequestConfig,
  // AxiosResponse
} from "axios";

function Platform({
  host,
  axiosConfig,
}: {
  host: string;
  axiosConfig: AxiosRequestConfig;
}) {
  return <Demo host={host} axiosConfig={axiosConfig} />;
}

export default Platform;
