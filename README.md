# ipfs-forms
IPFS Forms (like google forms on IPFS)

The project aims to manage forms like google forms.

It consists of
- ipfs-forms-render
- ipfs-forms-editor

 The editor users (the ones that creates the forms) use the ipfs-forms-editor to create the form. They are authenticated via fission auth and use fission drive to save forms in public folder.

 The users that fills the form use the ipfs-forms-render to enter the data. They are not authenticated (I thought that if a normal user that have to compile a form need to do authentication then it just quits, but maybe I should add an option for a filling user to use the ipfs-forms-render with authentication) and the form is saved with web3.storage and ecrypted with the editor user public key and retrieved and decrypted to see the results.

It uses fission.codes and web3.storage

At this time is not completed basically is done (as a proof of concept):
- form editor
- form render

is MISSING:
- form result.
