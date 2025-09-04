import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Cliente } from '../interfaces/cliente.interface';
import { IClienteState } from '../interfaces/cliente-state.interface';

@Injectable()
export class ClienteStateService {
  private readonly initialState: IClienteState = {
    cliente: null,
    cargando: false,
    error: false,
    esIdMongoValido: true
  };

  private readonly stateSubject = new BehaviorSubject<IClienteState>(this.initialState);
  public readonly state$ = this.stateSubject.asObservable();

  get currentState(): IClienteState {
    return this.stateSubject.value;
  }

  resetearEstados(): void {
    this.stateSubject.next(this.initialState);
  }

  setLoading(loading: boolean): void {
    this.stateSubject.next({
      ...this.currentState,
      cargando: loading
    });
  }

  setError(error: boolean): void {
    this.stateSubject.next({
      ...this.currentState,
      error
    });
  }

  setCliente(cliente: Cliente | null): void {
    this.stateSubject.next({
      ...this.currentState,
      cliente
    });
  }

  setIdValido(valido: boolean): void {
    this.stateSubject.next({
      ...this.currentState,
      esIdMongoValido: valido
    });
  }
}