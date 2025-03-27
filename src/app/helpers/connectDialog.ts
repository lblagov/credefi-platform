import { inject } from "@angular/core";
import { LoaderProvider } from "../providers";
import { MatDialog } from "@angular/material/dialog";
import { AccountProvider } from "../components/main/providers";
import { WalletConnectDialog } from "../components/main/shared/wallet-connect";
import { NoopScrollStrategy } from "@angular/cdk/overlay";

export abstract class ConnectDialog{
    private account = inject(AccountProvider);
    private loader = inject(LoaderProvider);
    private dialog = inject(MatDialog);
  
    async connect() {
      this.loader.show();
      this.account.getAllUserAccounts().subscribe(async (data) => {
        await this.loader.hide();
        this.dialog.open(WalletConnectDialog, {
          data,
          autoFocus: false,
          scrollStrategy: new NoopScrollStrategy(),
          panelClass: 'wallet-connect',
          backdropClass: 'back-drop-class' 
        });
      })
    }
  
  }
  