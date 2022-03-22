import { computed, inject, InjectionKey, provide, ref } from 'vue';
import { Supplier } from '@/types';
import { keyBy } from 'lodash';

export type SuppliersState = ReturnType<typeof provideSuppliersState>;

const stateKey: InjectionKey<SuppliersState> = Symbol('suppliers-state');

export const injectSuppliersState = () => {
  const state = inject(stateKey)
  if (!state)
    throw new Error(`${stateKey.toString()} - use provideSuppliersState()!`);

  return state;
};

export function provideSuppliersState () {
  const supplierList = ref<Supplier[]>([])

  const hashKeySuppliers = computed<Record<string, Supplier>>(() => supplierList.value.length
    ? keyBy(supplierList.value, 'id')
    : {})

  const state = {
    supplierList,
    hashKeySuppliers
  }

  provide(stateKey, state);

  return state
}