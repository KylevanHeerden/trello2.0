import * as fb from "@/firebase";

export default {
  state: {
    cards: [],
  },
  getters: {
    getCards(state) {
      return state.cards;
    },

    getCardsByProgrammeId: (state) => (id) => {
      let array = [];

      state.cards.forEach((card) => {
        if (card.team !== undefined) {
          array.push(card);
        }
      });

      let filtered = array.filter(
        (card) => card.team.programme.programme_id === id
      );
      return filtered;
    },

    getFilesCount: (state) => (id) => {
      let card = state.cards.filter((card) => card.id === id);

      return [card[0].files_count, card[0].files.length];
    },
  },
  mutations: {
    setCards(state, value) {
      state.cards = value;
    },
  },
  actions: {
    async getCards({ commit }) {
      fb.cardsCollection.onSnapshot(
        (cards) => {
          let cards_array = [];
          cards.forEach((doc) => {
            let object = {
              id: doc.id,
              name: doc.data().name,
              VAT: doc.data().VAT,
              contact_person: doc.data().contact_person,
              contact_number: doc.data().contact_number,
              createdOn: doc.data().createdOn,
              lead_time: doc.data().lead_time,
              list_id: doc.data().list_id,
              nano_item_num: doc.data().nano_item_num,
              nano_item_name: doc.data().nano_item_name,
              nano_item_description: doc.data().nano_item_description,
              product_id: doc.data().product_id,
              quantity: doc.data().quantity,
              supp_item_name: doc.data().supp_item_name,
              supp_item_num: doc.data().supp_item_num,
              supplier_name: doc.data().supplier_name,
              supplier_email: doc.data().supplier_email,
              supplier_quote_num: doc.data().supplier_quote_num,
              total_exc_vat: doc.data().total_exc_vat,
              total_inc_vat: doc.data().total_inc_vat,
              unit_price: doc.data().unit_price,
              updatedOn: doc.data().updatedOn,
              technical_approval: doc.data().technical_approval,
              purchase_approval: doc.data().purchase_approval,
              procured: doc.data().procured,
              receiver_approval: doc.data().receiver_approval,
              quality_approval: doc.data().quality_approval,
              files: doc.data().files,
              files_count: doc.data().files_count,
              purchase_order: doc.data().purchase_order,
              team: doc.data().team,
              creator: doc.data().creator,
              quality_photos: doc.data().quality_photos,
              payment_terms: doc.data().payment_terms,
              currency: doc.data().currency,
              hubdoc: doc.data().hubdoc,
              PO_number: doc.data().PO_number,
              POP: doc.data().POP,
              payments: doc.data().payments,
              delivery_date: doc.data().delivery_date,
              supplier_email_count: doc.data().supplier_email_count,
            };
            cards_array.push(object);
          });
          commit("setCards", cards_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },

    removeNotification({ dispatch }, cardId) {
      fb.cardsCollection.doc(cardId).delete();

      dispatch("getCards");
    },
  },
};
