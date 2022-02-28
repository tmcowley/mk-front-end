// abandoned
// issues with using setState methods (or Dispatch<SetStateAction<boolean>> s)

import {Dispatch, SetStateAction} from 'react';

import axios, { 
    AxiosRequestConfig
    // AxiosResponse 
} from "axios";

// API & Axios config
const axiosConfig: AxiosRequestConfig<string> = {
    headers: {
        // 'Content-Length': 0,
        "Content-Type": "text/plain",
    },
    responseType: "json",
};
// const host = "http://localhost:8080";
const host = "https://mirrored-keyboard.herokuapp.com";

// type setApiActiveType = Dispatch<SetStateAction<boolean>>;
// type setApiActiveType = ((_: boolean) => void) | Dispatch<SetStateAction<boolean>>;
type setApiActiveType = any;

export function queryAPIStatus(setApiActive: setApiActiveType) {
    const path = "/get/status";
    const url = host + path;

    axios.get(url).then(
        (response) => {
            // console.log("queryAPIStatus() - Response found");
            // console.log(response);
            setApiActive(true);
        },
        (error) => {
            console.log("queryAPIStatus() - API endpoints down");
            // console.log(error);

            setApiActive(false);
        }
    );
}

export function renderEquivalents(input: string, setLhsEquiv: Function, setRhsEquiv: Function, setApiActive: setApiActiveType) {
    if (!input || input === "") {
        setLhsEquiv("");
        setRhsEquiv("");
    }

    // calculate lhs interpretation
    var path = "/get/convert/lhs";
    var url = host + path;

    let config: AxiosRequestConfig<string> = axiosConfig;
    config["params"] = {
        input: input,
    };

    axios.get(url, config).then(
        (response) => {
            // console.log(response);

            const lhsEquiv = response.data;
            setLhsEquiv(lhsEquiv);
        },
        (error) => {
            console.log(error);
            queryAPIStatus(setApiActive);
        }
    );

    path = "/get/convert/rhs";
    url = host + path;

    axios.get(url, config).then(
        (response) => {
            // console.log(response);

            const rhsEquiv = response.data;
            setRhsEquiv(rhsEquiv);
        },
        (error) => {
            console.log(error);
            queryAPIStatus(setApiActive);
        }
    );
}

export function getPromptLeftForm(setPromptLHS: Function, setApiActive: setApiActiveType) {
    // calculate lhs interpretation
    var path = "/get/convert/lhs";
    var url = host + path;

    let config: AxiosRequestConfig<string> = axiosConfig;
    config["params"] = {
        input: prompt,
    };

    axios.get(url, config).then(
        (response) => {
            // console.log(response);
            const result = response.data;

            setPromptLHS(result);
        },
        (error) => {
            console.log(error);
            queryAPIStatus(setApiActive);
        }
    );
}

export function getPromptRightForm(setPromptRHS: Function, setApiActive: setApiActiveType) {
    // calculate rhs interpretation
    var path = "/get/convert/rhs";
    var url = host + path;

    let config: AxiosRequestConfig<string> = axiosConfig;
    config["params"] = {
        input: prompt,
    };

    axios.get(url, config).then(
        (response) => {
            // console.log(response);

            const result = response.data;

            setPromptRHS(result);
        },
        (error) => {
            console.log(error);
            queryAPIStatus(setApiActive);
        }
    );
}

export function postInput(input: string, setComputed: Function, setResults: Function, setApiActive: setApiActiveType) {
    if (!input || input === "") {
        setComputed(false);
        return;
    }

    const path = "/get/submit";
    const url = host + path;

    let config: AxiosRequestConfig<string> = axiosConfig;
    config["params"] = {
        input: input,
    };

    axios.get(url, config).then(
        (response) => {
            // generate the results array
            const resultsArray = response.data;
            resultsArray.reverse();
            setResults(resultsArray);

            setComputed(true);
        },
        (error) => {
            console.log(error);
            setComputed(false);
            setResults(undefined);
            queryAPIStatus(setApiActive);
        }
    );
}

export function populatePrompt(setPrompt: Function, setApiActive: setApiActiveType) {
    // get new prompt, populate
    const path = "/get/random-phrase";
    const url = host + path;

    axios.get(url).then(
        (response) => {
            // set prompt text
            let prompt: string = response.data;
            prompt = prompt.toLowerCase();
            setPrompt(prompt);
        },
        (error) => {
            console.log("Error");
            console.log(error);
            queryAPIStatus(setApiActive);
        }
    );
}