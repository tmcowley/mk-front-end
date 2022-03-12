import axios, { AxiosResponse } from "axios";
import { apiConfig } from '../constants/APIConfig'

enum Side {
    Left,
    Right,
}

export function queryServiceStatus(
    onSuccess: (response: AxiosResponse<any, any>) => void,
    onFail: (error: AxiosResponse<any, any>) => void
) {
    const { apiVersion, host, axiosGetConfigGenerator } = apiConfig
    const path = apiVersion + "get-status";
    const url = host + path;

    axios.get(url, axiosGetConfigGenerator({})).then(
        (response) => {
            console.log(`${path} - response found: `)
            console.log(response)
            onSuccess(response);
        },
        (error) => {
            console.log(`${path} - error found: `)
            console.log(error)
            onFail(error)
        }
    );
}

export function submit(
    input: string,
    onSuccess: (response: AxiosResponse<any, any>) => void,
    onFail: (error: AxiosResponse<any, any>) => void
) {
    if (input === "") return

    const { apiVersion, host, axiosGetConfigGenerator } = apiConfig
    const path = apiVersion + "submit"
    const url = host + path

    axios.get(url, axiosGetConfigGenerator({ 'input': input })).then(
        (response) => {
            console.log(`${path} - response found: `)
            console.log(response)
            // let resultsArray = response.data as string[]
            onSuccess(response)
        },
        (error) => {
            console.log(`${path} - error found: `)
            console.log(error)
            onFail(error)
        }
    );
}

/**
 * get a random phrase from the phrase set
 * @param onSuccess embedded into promise.then() response anon function
 * @param onFail embedded into promise.then() error anon function
 */
export function getRandomPhrase(
    onSuccess: (response: AxiosResponse<any, any>) => void,
    onFail: (error: AxiosResponse<any, any>) => void
) {
    const { apiVersion, host, axiosGetConfigGenerator } = apiConfig
    const path = apiVersion + "get-random-phrase";
    const url = host + path;

    axios.get(url, axiosGetConfigGenerator({})).then(
        (response) => {
            console.log(`${path} - response found: `)
            console.log(response)
            onSuccess(response)
        },
        (error) => {
            console.log(`${path} - error found: `)
            console.log(error)
            onFail(error)
        }
    );
}

export function getLeftEquivalent(
    str: string,
    onSuccess: (error: AxiosResponse<any, any>) => void,
    onFail?: (error: AxiosResponse<any, any>) => void
) {
    getSideEquivalent(Side.Left, str, onSuccess, onFail)
}

export function getRightEquivalent(
    str: string,
    onSuccess: (error: AxiosResponse<any, any>) => void,
    onFail?: (error: AxiosResponse<any, any>) => void
) {
    getSideEquivalent(Side.Right, str, onSuccess, onFail)
}

function getSideEquivalent(
    half: Side,
    str: string,
    onSuccess: (response: AxiosResponse<any, any>) => void,
    onFail?: (error: AxiosResponse<any, any>) => void
) {
    if (str === "") return

    const { apiVersion, host, axiosGetConfigGenerator } = apiConfig

    let path = apiVersion
    if (half === Side.Left) {
        path = path + "convert-lhs";
    } else if (half === Side.Right) {
        path = path + "convert-rhs";
    } else {
        return
    }

    let url = host + path;

    axios.get(url, axiosGetConfigGenerator({ 'input': str })).then(
        (response) => {
            console.log(`${path} - response found: `);
            console.log(response)
            // let equiv = response.data as string
            onSuccess(response)
        },
        (error) => {
            console.log(`${path} - error found: `)
            console.log(error)
            onFail?.(error)
        }
    );
}

export function signOut(
    onSuccess: (response: AxiosResponse<any, any>) => void,
    onFail?: (error: AxiosResponse<any, any>) => void
) {
    const { apiVersion, host, axiosPostConfig } = apiConfig
    const path = apiVersion + "sign-out";
    const url = host + path;
    const data = null;

    axios.post(url, data, axiosPostConfig).then(
        (response) => {
            console.log(`${path} - response found: `);
            console.log(response)
            onSuccess(response)
        },
        (error) => {
            console.log(`${path} - error found: `)
            console.log(error)
            onFail?.(error)
        }
    );
}

export function signIn(
    formValues: {userCode: string}, 
    onSuccess: (response: AxiosResponse<any, any>) => void,
    onFail?: (error: AxiosResponse<any, any>) => void
) {
    const { apiVersion, host, axiosPostConfig } = apiConfig
    const path = apiVersion + "sign-in";
    const url = host + path;
    const data = JSON.stringify(formValues, null, 2)

    axios.post(url, data, axiosPostConfig).then(
        (response) => {
            console.log(`${path} - response found: `);
            console.log(response)
            onSuccess(response)
        },
        (error) => {
            console.log(`${path} - error found: `)
            console.log(error)
            onFail?.(error)
        }
    );
}

export function signUp(
    formValues: {
        age: number | undefined,
        speed: number | undefined,
      }, 
    onSuccess: (response: AxiosResponse<any, any>) => void,
    onFail?: (error: AxiosResponse<any, any>) => void
){
    const { apiVersion, host, axiosPostConfig } = apiConfig
    const path = apiVersion + "sign-up";
    const url = host + path;
    const data = JSON.stringify(formValues, null, 2)

    axios.post(url, data, axiosPostConfig).then(
      (response) => {
        console.log(`${path} - response found: `);
        console.log(response)
        onSuccess(response)
      },
      (error) => {
        console.log(`${path} - error found: `)
        console.log(error)
        onFail?.(error)
      }
    );
}

export function isLoggedIn(
    onSuccess: (response: AxiosResponse<any, any>) => void,
    onFail?: (error: AxiosResponse<any, any>) => void
){
    const { apiVersion, host, axiosPostConfig } = apiConfig
    const path = apiVersion + "is-logged-in"
    const url = host + path
    const data = null

    axios.post(url, data, axiosPostConfig).then(
      (response) => {
        console.log(`${path} - response found: `);
        console.log(response)
        onSuccess(response)
      },
      (error) => {
        console.log(`${path} - error found: `)
        console.log(error)
        onFail?.(error)
      }
    );
}
