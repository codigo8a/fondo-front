export interface IAlertDialogData {
  title: string;
  message: string;
  type: AlertType;
  isConfirmation?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export interface IAlertDialogActions {
  close(): void;
  confirm?(): void;
  cancel?(): void;
}

export interface IAlertDialogPresentation {
  getIcon(): string;
  getButtonColor(): string;
}

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface IAlertDialogConfig {
  width?: string;
  maxWidth?: string;
  disableClose?: boolean;
  panelClass?: string;
  backdropClass?: string;
}