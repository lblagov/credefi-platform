import { inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NoopScrollStrategy } from "@angular/cdk/overlay";
import { WalletConnectXRPLDialog } from "../components/main/shared/wallet-connect-xrpl";

export abstract class ConnectXRPLDialog{
    private dialog = inject(MatDialog);
  
    async connect() {
      this.dialog.open(WalletConnectXRPLDialog, {
        autoFocus: false,
        scrollStrategy: new NoopScrollStrategy(),
        panelClass: 'wallet-connect',
        backdropClass: 'back-drop-class' 
      });
    }
  
  }
  