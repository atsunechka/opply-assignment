import { Maybe } from '@/types';
import { ref, Ref, watch } from 'vue';
import { Router, useRoute } from 'vue-router';
import { isEqual } from 'lodash';

export const loginTexts = {
  mainButton: 'Log in',
  headerText: 'Sign in to the app',
  footerText: 'Don\'t have an account?',
  footerButton: 'Sign up'
}

export const signUpTexts = {
  mainButton: 'Sign up',
  headerText: 'Create a new user',
  footerText: 'Already have an account?',
  footerButton: 'Log in'
}
interface FetchDataParams {
  url: string,
  data: Maybe<object>,
  method: 'GET' | 'POST'
}

let router: Router;

export function provideRouter (appRouter: Router) {
  router = appRouter;
}

export function useRouter () {
  return router;
}


export function useRouteQuery () {
  const currentRoute = useRoute();
  const query = ref(currentRoute.query);

  // Избавление от проблемы лишнего тригера при тех же параметрах
  watch(() => currentRoute.query, onlyWhenChanged(value => {
    query.value = value;
  }));

  return query;
}

function onlyWhenChanged<T> (
  callback: (newValue: T, oldValue: T) => unknown
) {
  return (newValue: T, oldValue: T) =>
    !isEqual(newValue, oldValue) && callback(newValue, oldValue);
}


export const getFetchData = async (
  { url, data, method, token }: FetchDataParams &  { token: Maybe<string> }
) => {
  const baseUrl = 'https://february-21.herokuapp.com';
  const getParams = new URLSearchParams();
  const isGet = method === 'GET'
  if (isGet && data) {
    for (const entry of Object.entries(data)) {
      getParams.append(entry[0], entry[1])
    }
  }

  const resultUrl = isGet && data
    ? `${baseUrl}/${url}/?${getParams.toString()}`
    : `${baseUrl}/${url}/`


  try {
    const response = await fetch(resultUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {})
      },
      ...(isGet ? {} : { body: JSON.stringify(data) })
    });

    return response.json();
  }
  catch (error) {
    console.error('Fetch error: ', error)
  }

}
