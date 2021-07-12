<template>
  <div class="products">
    <v-breadcrumbs :items="links" divider="/"> </v-breadcrumbs>

    <v-container fluid class="my-5">
      <v-row class="mx-3" wrap>
        <v-col
          xs12
          sm6
          md2
          v-for="list in this.Array"
          :key="list.list_name"
          :class="`list-group mx-2 ${list.list_status}`"
          :data-cypress="`column-${list.list_status}`"
        >
          <!--Runs through the local3000 array of list populated according to the product-->
          {{ list.list_name }}
          <br />
          <Draggable
            :list="cards1(list.id)"
            class="list-group list-col my-3"
            group="cards"
            @change="cardMoved(list.id, $event)"
            :data-cypress="`dragZone-${list.list_status}`"
            draggable=".draggable"
          >
            <!--Makes the child component draggable. Require :list and group properties to work.-->
            <Card
              v-for="card in cards1(list.id)"
              :key="card.id"
              class="list-group-item"
              :class="checkMove(card, list.id)"
              :card="card"
              :listId="list.id"
              :cardComments="commentsByCard(card.id)"
              :team="team"
              :product="product"
              data-cypress="card"
              @snackbar-Fn="snackbarFn"
            ></Card>
          </Draggable>
          <div v-if="list.id === 1" class="text-right">
            <NewCard
              :productId="productId"
              :programme="programme"
              :team="team"
            ></NewCard>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
      v-model="snackbar.snackbar"
      color="primary"
      :timeout="snackbar.timeout"
    >
      {{ `You moved a card to ${snackbar.newListName}` }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar.snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
// @ is an alias to /src
import Draggable from "vuedraggable";
import Card from "@/components/Card.vue";
import NewCard from "@/components/NewCard.vue";
import { db } from "@/firebase";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Products",
  components: { Draggable, Card, NewCard },
  data() {
    return {
      productId: String(this.$route.params.id),
      fetchedProductId: this.$route.params.id,
      update: true,
      Array: [
        // Updates this data according to products page you on
        {
          id: 1,
          list_name: "Quotes",
          list_status: "Quotes",
          cards: [],
        },
        {
          id: 2,
          list_name: "Technical Approval",

          list_status: "Technical",
          cards: [],
        },
        {
          id: 3,
          list_name: "Purchase Approval",

          list_status: "Purchase",
          cards: [],
        },
        {
          id: 4,
          list_name: "Activate Purchase",

          list_status: "Procurement",
          cards: [],
        },
        {
          id: 5,
          list_name: "Follow Up",
          list_status: "FollowUp",
          cards: [],
        },
        {
          id: 6,
          list_name: "Quality Approval",

          list_status: "Quality",
          cards: [],
        },
      ],
      snackbar: {
        snackbar: false,
        timeout: 20000000,
        newListName: "", //This is provided by cardMoved function
      },
    };
  },

  watch: {
    update: function() {
      console.log(this.update);
    },
  },

  computed: {
    ...mapState({
      cards(state) {
        let unfilteredCards = state.cards.cards;
        let cards = unfilteredCards.filter(
          (card) => card.product_id === this.productId
        );
        let sortedCards = cards.sort((a, b) => a.createdOn - b.createdOn);
        //This method is to populate lists.cards of Array
        sortedCards.map((card) =>
          this.Array[card.list_id - 1].cards.push(card)
        );
        return cards;
      },
      comments: (state) => state.comments.comments,
      notifications: (state) => state.notifications.notifications,
    }),
    ...mapGetters([
      "getProductById",
      "getProgrammeById",
      "getTeams",
      "getCards",
      "getNotifications",
    ]),

    product() {
      let product = this.getProductById(this.fetchedProductId);

      return product;
    },
    programme() {
      if (this.product == undefined) {
        let programme = this.getProgrammeById(
          this.product.programme.programme_id
        );

        return programme;
      } else {
        let programme = this.getProgrammeById(
          this.product.programme.programme_id
        );

        return programme;
      }
    },

    team() {
      let teams = this.getTeams;
      let team = teams.filter(
        (team) => team.programme.programme_id === this.programme.id
      );
      return team[0];
    },
    links() {
      if (this.product == undefined) {
        return [
          {
            text: "Programmes",
            to: "/",
          },
        ];
      } else if (this.programme == undefined) {
        return [
          {
            text: "Programmes",
            to: "/",
          },
        ];
      } else {
        return [
          {
            text: "Programmes",
            to: "/",
          },
          {
            text: `${this.programme.name}`,
            to: "/programme/" + `${this.programme.id}`,
          },
          {
            text: `${this.product.name}`,
            to: "/product/" + this.product.id,
          },
        ];
      }
    },
  },

  methods: {
    checkMove(card, listID) {
      if (listID === 1 || listID === 5) {
        return "draggable";
      } else {
        return;
      }
    },

    async cardMoved(listId, e) {
      const evt = e.added || e.moved; //the events triggered by draggable
      if (evt == undefined) {
        return;
      }
      const card = evt.element; // these to if statements prevent stupid errors to occur
      if (card == undefined) {
        return;
      }

      const fbCard = db.collection("cards").doc(card.id); // gets the firebase card
      await fbCard.update({ list_id: listId }); // updates the list id on the firebase card

      this.snackbar.newListName = this.Array.find(
        // set the name for the snackbar to show where card moved to
        (list) => list.id === listId
      ).list_name;
      this.snackbar.snackbar = true;

      const fbProduct = db.collection("products").doc(card.product_id);
      await fbProduct.update({
        status: this.Array[listId - 1].list_status,
      });

      const person_array = [
        "technical_approver",
        "purchase_approver",
        "procurer",
        "purchase_approver", // Nanodyn doctrine is set that purchase approver is notified if item is awaiting
      ];
      const toCall = person_array[listId - 2];

      if (this.team[toCall] == undefined) {
        // card creator notified when card is in quality
        db.collection("notifications").add({
          card_id: card.id,
          product: {
            product_name: this.product.name,
            product_id: this.product.id,
          },
          programme: {
            programme_name: this.product.programme.programme_name,
            programme_id: this.product.programme.programme_id,
          },
          user_id: card.creator,
          createdOn: new Date(),
          status: this.Array[listId - 1].list_status,
        });
      } else if (listId - 2 === 3) {
        // Now purchase approver and card creator is notified when card is in awaiting
        db.collection("notifications").add({
          card_id: card.id,
          product: {
            product_name: this.product.name,
            product_id: this.product.id,
          },
          programme: {
            programme_name: this.product.programme.programme_name,
            programme_id: this.product.programme.programme_id,
          },
          user_id: card.creator,
          createdOn: new Date(),
          status: this.Array[listId - 1].list_status,
        });

        this.team[toCall].users.forEach((notify) => {
          db.collection("notifications").add({
            card_id: card.id,
            product: {
              product_name: this.product.name,
              product_id: this.product.id,
            },
            programme: {
              programme_name: this.product.programme.programme_name,
              programme_id: this.product.programme.programme_id,
            },
            user_id: notify.value,
            createdOn: new Date(),
            status: this.Array[listId - 1].list_status,
          });
        });
      } else {
        // nofity relevant party when card moves to column
        this.team[toCall].users.forEach((notify) => {
          db.collection("notifications").add({
            card_id: card.id,
            product: {
              product_name: this.product.name,
              product_id: this.product.id,
            },
            programme: {
              programme_name: this.product.programme.programme_name,
              programme_id: this.product.programme.programme_id,
            },
            user_id: notify.value,
            createdOn: new Date(),
            status: this.Array[listId - 1].list_status,
          });
        });
      }

      this.getNotifications;
    },

    commentsByCard(cardId) {
      let card_comments = this.comments.filter(
        (comment) => comment.card_id === cardId
      );
      return card_comments;
    },

    cards1(id) {
      let unfilteredCards = this.getCards;
      let cards = unfilteredCards.filter(
        (card) => card.product_id === this.productId
      );
      let listCards = cards.filter((card) => card.list_id === id);
      return listCards;
    },

    snackbarFn() {
      console.log("Grandparent Hello");
    },
  },

  created() {
    //Methods run before page load complete so that data available in store but also local3000ly in component
    this.$store.dispatch("getProducts");
    this.$store.dispatch("getProgrammes");
    this.$store.dispatch("getSuppliers");
    this.$store.dispatch("getComments");
    this.$store.dispatch("getTeams");
    this.$store.dispatch("getLineItems");
    this.$store.dispatch("getNotifications");
  },

  mounted() {
    this.$store.dispatch("getCards");
  },
};
</script>

<style scoped>
.col {
  font-weight: 300;
  background-color: white;
  border-radius: 2%;
  color: grey;
}
.col.Quotes {
  border-top: 4px solid #26a69a;
}

.col.Technical {
  border-top: 4px solid #f8d04d;
}

.col.Purchase {
  border-top: 4px solid orange;
}

.col.Procurement {
  border-top: 4px solid tomato;
}

.col.FollowUp {
  border-top: 4px solid #9ccc65;
}

.col.Quality {
  border-top: 4px solid #5c6bc0;
}

.list-col {
  min-height: 500px;
}
</style>
