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
        >
          <!--Runs through the local3000 array of list populated according to the product-->
          {{ list.list_name }}
          <br />
          <Draggable
            :list="cards1(list.id)"
            class="list-group list-col my-3"
            group="cards"
            @change="cardMoved(list.id, $event)"
          >
            <!--Makes the child component draggable. Require :list and group properties to work.-->
            <Card
              v-for="card in cards1(list.id)"
              :key="card.id"
              class="list-group-item"
              :card="card"
              :listId="list.id"
              :cardComments="commentsByCard(card.id)"
              :team="team"
            ></Card>
          </Draggable>
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
import { db } from "@/firebase";

export default {
  name: "Products",
  components: { Draggable, Card },
  data() {
    return {
      programmeId: String(this.$route.params.id),
      fetchedProgrammeId: this.$route.params.id,
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
          list_name: "Purchasing",

          list_status: "Procurement",
          cards: [],
        },
        {
          id: 5,
          list_name: "Awaiting Delivery",
          list_status: "Waiting",
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

  methods: {
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
        "quality_approver",
      ];
      const toCall = person_array[listId - 2];

      const product = this.products.find(
        (product) => product.id === card.product_id
      );

      if (this.team[toCall] == undefined) {
        db.collection("notifications").add({
          card_id: card.id,
          product: {
            product_name: product.name,
            product_id: product.id,
          },
          programme: {
            programme_name: product.programme.programme_name,
            programme_id: product.programme.programme_id,
          },
          user_id: card.creator,
          createdOn: new Date(),
          status: this.Array[listId - 1].list_status,
        });
      } else {
        this.team[toCall].users.forEach((notify) => {
          db.collection("notifications").add({
            card_id: card.id,
            product: {
              product_name: product.name,
              product_id: product.id,
            },
            programme: {
              programme_name: product.programme.programme_name,
              programme_id: product.programme.programme_id,
            },
            user_id: notify.value,
            createdOn: new Date(),
            status: this.Array[listId - 1].list_status,
          });
        });
      }

      this.$store.dispatch("getNotifications");
    },

    commentsByCard(cardId) {
      let card_comments = this.comments.filter(
        (comment) => comment.card_id === cardId
      );
      return card_comments;
    },

    cards1(id) {
      let listCards = this.cards.filter((card) => card.list_id === id);
      return listCards;
    },
  },

  computed: {
    products() {
      let products = this.$store.getters.getProducts;
      return products;
    },

    programme() {
      let programme = this.$store.getters.getProgrammeById(
        this.fetchedProgrammeId
      );
      return programme;
    },
    lists() {
      let lists = this.$store.getters.getLists;
      return lists;
    },
    cards() {
      let cards = this.$store.getters.getCardsByProgrammeId(this.programme.id);
      let sortedCards = cards.sort((a, b) => a.createdOn - b.createdOn);
      // //This method is to populate lists.cards of Array
      sortedCards.map((card) => this.Array[card.list_id - 1].cards.push(card));
      return cards;
    },

    suppliers() {
      let suppliers = this.$store.getters.getSuppliers;
      return suppliers;
    },
    comments() {
      let comments = this.$store.getters.getComments;
      return comments;
    },
    team() {
      let team = this.$store.getters.getTeamsByProgrammeId(this.programme.id);
      return team;
    },
    user() {
      let user = this.$store.getters.getUserProfile;
      return user;
    },
    users() {
      let users = this.$store.getters.getUserProfile;
      return users;
    },
    links() {
      if (this.programme == undefined) {
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
            to: "/programme/" + `${this.fetchedProgrammeId}`,
          },
        ];
      }
    },
  },
  created() {
    //Methods run before page load complete so that data available in store but also local3000ly in component
    this.$store.dispatch("getProducts");
    this.$store.dispatch("getProgrammes");
    this.$store.dispatch("getLists");
    this.$store.dispatch("getSuppliers");
    this.$store.dispatch("getComments");
    this.$store.dispatch("getTeams");
    this.$store.dispatch("getLineItems");
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

.col.Waiting {
  border-top: 4px solid #9ccc65;
}

.col.Quality {
  border-top: 4px solid #5c6bc0;
}

.list-col {
  min-height: 500px;
}
</style>
