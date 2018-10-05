# EUREKA address

Each author needs to be uniquely recognized in order to know where to send the tokens to in case an author gets cited.

One idea is to store the mapping in a central place in the EUREKA platform. An other idea is to store the mapping directly on the paper. Thus, the Ethereum address needs to be published together in a paper on the title page as well as in the references.

If we want to support existing papers, then we need to implement the central approach. For new papers, the decentralized approch can be used, where address is directly stored on the paper.

## EUREKA address design

Goals:
 * One goal for the address is to be as compact as possible.
 * To be easy recogizable
 * Avoid copy/paste error or typos (e.g. by using printable characters)

Thus, we propose the following:
 * printable and compact: base58 for the whole 32byte address
 * errors: checksum
 * recoginzable: prefix EKA

Example:
[EKA192af1d185a829dedac13f58d051002dCC]

## EUREKA address supporting site

* Since the address also shows the track record of a scientist, a web page needs to be built to display this information.

* Another web page needs to be built where such an address can be created. The public private key generation needs to be done exclusively on the client. The output is the EUREKA address and alternatively QR-Code, or LaTeX code that could be used directly in a paper.

* Furthermore, a web page needs to be built where the address can be linked to an email address and name. With the private key, name and email can be changed. By changed, it means it can be added, but previous records will not be removed, only marked as outdated. The email needs to be verified in order to prevent spoofing. The verification of public-key/email requires a proof of the posession of the private key and that one is able to receive email on that account.

* A web page needs to be built where a PDF can be uploaded and the relevent EUREKA addresses are being displayed. If none is found, the user has the possibility to propose EUREKA address/email links.
