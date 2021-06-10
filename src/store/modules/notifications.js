import * as fb from "@/firebase";

export default {
  state: {
    notifications: [],
  },
  getters: {
    getNotifications(state) {
      return state.notifications;
    },
  },
  mutations: {
    setNotifications(state, value) {
      state.notifications = value;
    },
  },
  actions: {
    async getNotifications({ commit }) {
      fb.notificationsCollection.onSnapshot(
        (notifications) => {
          let notifications_array = [];
          notifications.forEach((doc) => {
            let object = {
              id: doc.id,
              createdOn: doc.data().createdOn,
              programme: doc.data().programme,
              product: doc.data().product,
              card_id: doc.data().card_id,
              status: doc.data().status,
              user_id: doc.data().user_id,
            };
            notifications_array.push(object);
          });

          commit("setNotifications", notifications_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },

    removeNotification({ dispatch }, notificationId) {
      fb.notificationsCollection.doc(notificationId).delete();

      dispatch("getNotifications");
    },
  },
};
