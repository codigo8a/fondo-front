import { Injectable } from '@angular/core';
import { IClienteValidator } from '../interfaces/cliente-validator.interface';


@Injectable({
  providedIn: 'root'
})
export class ClienteValidatorService implements IClienteValidator {
  validarIdMongo(id: string): boolean {
    if (!id) return false;
    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
    return mongoIdRegex.test(id);
  }
}