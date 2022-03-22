import { inject, InjectionKey, onBeforeMount, onBeforeUpdate, onMounted, provide, ref } from 'vue';
import { FetchDataParams, Maybe, RouteNames, User } from '@/types';
import { getFetchData, useRouter } from '@/utils';

export type AppState = ReturnType<typeof provideAppState>;

const stateKey: InjectionKey<AppState> = Symbol('app-state');

export const injectAppState = () => {
  const state = inject(stateKey)
  if (!state)
    throw new Error(`${stateKey.toString()} - use provideAppState()!`);

  return state;
};

export function provideAppState () {
  const authToken = ref<Maybe<string>>(null);
  const hasAuthToken = ref(false);
  const router = useRouter();

  const user = ref<User>({
    username: '',
    password: '',
    passwordCheck: '',
    first_name: '',
    last_name: '',
    email: ''
  })


  const getFetchRequest = async ({ url, data, method }: FetchDataParams) => {
    return getFetchData({
      url, data, method, token: authToken.value
    })
  }

  const init = async () => {
    if ([RouteNames.LOGIN, RouteNames.REGISTER].includes(router.currentRoute.value.name as RouteNames))
      return;

    const token = localStorage.getItem('auth_token');

    if (!token) {
       await router.push(RouteNames.LOGIN);
       return;
    }

    hasAuthToken.value = true;
    authToken.value = token;
  }

  init();

  const state = {
    user,
    hasAuthToken,
    authToken,
    getFetchRequest
  }

  provide(stateKey, state);

  return state
}