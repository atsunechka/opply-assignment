<template>
  <div :class="$style.auth" >
    <form :class="$style.form" id="login">
      <div :class="$style.header" v-text="authTexts.headerText"/>
      <div v-for="(item, key) in authForm" :key="key" :class="$style.field">
        <div :class="[$style.field__text, item.required && $style.field__text_required]" v-text="item.text"/>
        <input :class="$style.field__value"
               :type="key.includes('password') ? 'password' : 'text'"
               :maxlength="item.maxLength"
               :autocomplete="false"
               @change="checkField(item, key)"
               v-model="user[key]">
        <div v-if="errors[key] && errors[key].length" :class="$style.field__error" v-text="errors[key]"/>
      </div>
      <div :class="$style.button" v-text="authTexts.mainButton" @click="handleLogin"/>
      <div :class="$style.switch_auth">
        <div v-text="authTexts.footerText"/>
        <button :class="$style.link" v-text="authTexts.footerButton" @click="toggleAuth"/>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { loginTexts, signUpTexts, useRouter } from '@/utils';
import { AuthField, AuthKeys, RouteNames, SignUpResult, User } from '@/types';
import { injectAppState } from '@/app.provider';


export default defineComponent({
  name: 'Auth',
  props: {
    hasAccount: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const state = injectAppState();
    const router = useRouter();
    const { user, hasAuthToken, getFetchRequest, authToken } = state;
    const authTexts = computed(() => props.hasAccount ? loginTexts : signUpTexts);

    const errors = ref<User>({
      username: '',
      password: '',
      passwordCheck: ''
    })

    const loginForm = ref<Record<string, AuthField>>({
      username: {
        text: 'Username',
        required: true,
        value: user.value.username,
        maxLength: 150,
        validate: (value: string) => {
          let validString = '';

          if (value.match(/[a-zA-Z1-9@/./+/-/_]/g)?.length !== value.length)
            validString = "Username should contain letters, digits and @/./+/-/_ only"

          errors.value.username = validString
        }
      },
      password: {
        text: 'Password',
        required: true,
        maxLength: 128,
        value: user.value.password
      }
    })

    const signInForm = ref({
      ...loginForm.value,
      passwordCheck: {
        text: 'Repeat the password',
        required: true,
        maxLength: 128,
        value: user.value.password,
        validate: (value: string) => {
          errors.value.passwordCheck = value !== user.value.password ? "Passwords aren't the same" : ''
        }
      },
      first_name: {
        text: 'First name',
        maxLength: 150,
        value: user.value.first_name
      },
      last_name: {
        text: 'Last name',
        maxLength: 150,
        value: user.value.last_name
      },
      email: {
        text: 'Email',
        maxLength: 254,
        value: user.value.username
      },
    });

    const authForm = computed(() => props.hasAccount ? loginForm.value : signInForm.value)

    const toggleAuth = () => {
       return props.hasAccount
         ? router.push(RouteNames.REGISTER)
         : router.push(RouteNames.LOGIN)
    }
    
    const handleLogin = () => {
      (Object.keys(authForm.value) as Partial<AuthKeys>[]).map(fieldKey => {
        checkField((authForm.value as Record<AuthKeys, AuthField>)[fieldKey], fieldKey);
      })

      if ((Object.keys(errors.value) as (keyof typeof errors.value)[])
        .find(errorKey => errors.value[errorKey]?.length))
        return;

      if (props.hasAccount)
        loginUser(user.value)
      else
        createUser(user.value)
    }

    const checkField = (field: AuthField, key: AuthKeys) => {
      errors.value[key] = ''
      if (field.required && user.value[key]!.length < 1) {
        errors.value[key] = `${field.text} cannot be empty`
        return;
      }

      if (field.validate)
        field.validate(user.value[key]!)
    }

    const loginUser = async (user: User) => {
      const loginInformation = {
        username: user[AuthKeys.username],
        password: user[AuthKeys.password]
      }

      const response = await getFetchRequest({
        url: 'api-token-auth',
        data: loginInformation,
        method: 'POST'
      }) as { token: string }

      if (response)
        handleAuthResponse(response.token)
      else
        console.error('Something went wrong, please repeat the request', response)

    }

    const createUser = async (user: User) => {
      delete user['passwordCheck'];
      const response = await getFetchRequest( {
        url: 'api/v1/users',
        data: user,
        method: 'POST'
      }) as SignUpResult

      if (response)
        handleAuthResponse(response.auth_key)
      else
        console.error('Something went wrong, please repeat the request', response)

    }


    const handleAuthResponse = (token: string) => {
      hasAuthToken.value = true
      authToken.value = token
      localStorage.setItem('auth_token', token);
      router.push(RouteNames.SUPPLIERS);
    }


    return {
      authTexts,
      toggleAuth,
      hasAuthToken,
      authForm,
      errors,
      signInForm,
      handleLogin,
      checkField,
      user,
      createUser
    }
  }
});

</script>

<style lang="scss" module>
  .auth {
    width: 550px;
    margin: auto;
    padding: 1.2rem 2.4rem;
    border-radius: 0.5rem;
    border: 1px solid #5e5e5e;
  }

  .header {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .field {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 15rem;
    margin: auto auto 1.8rem;
    position: relative;
  }

  .field__text {
    width: 100%;
    text-align: start;
    margin-left: -2rem;
    margin-bottom: 0.2rem;
  }

  .field__text_required {
    display: flex;
    align-items: center;

    &:after {
      content: '*';
      color: #af0a0a;
      display: block;
      width: auto;
      margin-left: 0.2rem;

    }
  }

  .field__value {
    width: 100%;
    padding: 0.4rem 0.8rem;
  }

  .switch_auth {
    display: flex;
    justify-content: center;
  }

  .link {
    text-decoration: underline;
    font-size: 0.9rem;
  }

  .button {
    padding: 0.4rem 0.6rem;
    cursor: pointer;
    background-color: darkslategray;
    color: whitesmoke;
    font-size: 1rem;
    width: 10rem;
    border: 1px solid darkslategray;
    border-radius: 0.2rem;
    margin: auto auto 2rem;
  }

  .field__error {
    position: absolute;
    bottom: -1.4rem;
    white-space: nowrap;
    font-size: 0.9rem;
    font-weight: 500;
    left: -1rem;
    color: #af0a0a;
  }
</style>
