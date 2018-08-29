import AddressBook from '../schema/address-book.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

export default {
  getContacts: async (address) => {
    const contacts = await AddressBook.find({addressBookOwnerAddress: address});
    if (!contacts) errorThrower.internalError();
      return contacts;
  },

  createContact: (addressBookOwnerAddress,
                  {
                    contactAddress,
                    preName,
                    lastName,
                    info
                  }) => {
    const contact = new AddressBook({
      addressBookOwnerAddress: addressBookOwnerAddress,
      contactAddress: contactAddress,
      preName: preName,
      lastName: lastName,
      info: info
    });
    return contact.save(function(err) {
      if (err) return console.error(err);
      console.log('Created new contact on DB done');
    });
  },

  deleteContact: async (addressBookOwnerAddress, contactAddress) => {
    const contact = await AddressBook.findOne({addressBookOwnerAddress: addressBookOwnerAddress, contactAddress: contactAddress});
    return await contact.remove();
  }
};
