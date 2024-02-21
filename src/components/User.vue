<template>
    <div class="home" style="margin-top: -5%">
        <div class="div-2">
            <nav class="navbar navbar-expand-lg navbar-light landing-page-header responsive-nav-bar ">
                <div class="container-fluid"><img :src="'../Logo (1).png'" alt="logo" class="logo" /></div>
            </nav>
    
            <div class="row frame-3" style="margin-bottom: 5% !important">
                    <div class="card">
                        <h1>{{ user.firstName }} {{ user.lastName }}</h1>
                        <p class="title">{{user.email}}</p>
                        <p v-if="user.revokeReason">Revoke Reason: {{user.revokeReason}}</p>
                        <p>
                            <button v-if="user.file1" style="margin-right: 1%" class="btn btn-success" @click="download(user.file1, 'file_1')">SAMA LOA/LOI Letter</button>
                            <button v-if="user.file2" style="margin-right: 1%" class="btn btn-success" @click="download(user.file2, 'file_2')">CR Certificate</button>
                            <button v-if="user.file3" class="btn btn-success" @click="download(user.file3, 'file_3')">Saudi Payments Certificate</button>
                        </p>
                        <p><button v-if="!user.enabled" class="btn btn-primary" @click="approve(user.id)">Approve</button></p>
                        <p><button v-if="user.status == 'pendding'" class="btn btn-danger" @click="toggleModal">Reject</button></p>
                        <p><button v-if="user.enabled" class="btn btn-danger" @click="revoke(user.id)">Revoke</button></p>
                    </div>
                </div>
        </div>
        <Modal @close="toggleModal" :modalActive="modalActive">
            <form class="form-frame-wrapper" id="fileForm" method="POST" @submit.prevent="reject(user.id)">

                <div class="row frame-3">
                    <div class="row">
                        <div class="col-md-12">
                            <div>
                                <input type="text" placeholder="reason" class="input form-control" name="reason" id="reason" v-model.trim="reason">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div><button class="submit-btn" :disabled="buttonDisabled"  type="submit">submit</button></div>
                    </div>
                </div>
            </form>
        </Modal>        
    </div>
</template>
<script>
import { LODING_SPINNER_SHOW_MUTATION } from "../store/storeconstants";
import axios from 'axios';
import Modal from "@/components/Modal.vue";
import { ref } from "vue";
export default {
    components: {
        Modal,
    },
    setup() {
        const modalActive = ref(false);

        const toggleModal = () => {
        modalActive.value = !modalActive.value;
        };

        return { modalActive, toggleModal };
    },
    data() {
        return {
            user: '',
            showModal: false,
            reason: '',
            buttonDisabled: false
        }
    },
    methods: {
        download(base64Pdf, name) {
            // Decode the base64 string
            const binaryPdf = atob(base64Pdf);

            // Create an ArrayBuffer from the binary data
            const arrayBuffer = new ArrayBuffer(binaryPdf.length);
            const uint8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < binaryPdf.length; i++) {
                uint8Array[i] = binaryPdf.charCodeAt(i);
            }

            // Create a Blob object
            const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

            // Create a URL for the Blob object
            const url = window.URL.createObjectURL(blob);

            // Create a link element
            const link = document.createElement('a');
            link.href = url;
            link.download = name + '.pdf'; // Set the filename for the downloaded file

            // Programmatically click the link to trigger the download
            link.click();

            // Clean up: revoke the URL
            window.URL.revokeObjectURL(url);

        },
        async approve(id) {
            this.$store.commit(LODING_SPINNER_SHOW_MUTATION, true, {root: true});
            let data = JSON.stringify({
                "enabled": true
            });
            let config = {
                method: 'put',
                maxBodyLength: Infinity,
                url: `https://keycloak-sit-vaps-sit.apps.nt-non-ocp.neotek.sa/admin/realms/master/users/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-data')).data.access_token}`,
                },
                data: data
            };

            try {
                await axios.request({
                    method: 'put',
                    maxBodyLength: Infinity,
                    url: `http://localhost:3000/update-user/${id}?email=${this.user.email}&userName=${this.user.firstName} ${this.user.lastName}`,
                    data: {
                        status: 'Approved',
                    }
                });
                await axios.request(config);
                this.user.enabled = true;
                this.user.status = 'Approved'
                this.$store.commit(LODING_SPINNER_SHOW_MUTATION, false, {root: true});
            } catch (err) {
                this.$store.commit(LODING_SPINNER_SHOW_MUTATION, false, {root: true});
                console.log(err)
            }
        },
        async revoke(id) {
            this.$store.commit(LODING_SPINNER_SHOW_MUTATION, true, {root: true});
            let data = JSON.stringify({
                "enabled": false
            });
            let config = {
                method: 'put',
                maxBodyLength: Infinity,
                url: `https://keycloak-sit-vaps-sit.apps.nt-non-ocp.neotek.sa/admin/realms/master/users/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-data')).data.access_token}`,
                },
                data: data
            };

            try {
                await axios.request({
                    method: 'put',
                    maxBodyLength: Infinity,
                    url: `http://localhost:3000/update-user/${id}?email=${this.user.email}&userName=${this.user.firstName} ${this.user.lastName}`,
                    data: {
                        status: 'Revoked',
                    }
                });
                await axios.request(config);
                this.modalActive = false;
                this.user.enabled = false;
                this.user.revokeReason = this.reason;
                this.reason = '';
                this.user.status = 'Revoked'
                this.$store.commit(LODING_SPINNER_SHOW_MUTATION, false, {root: true});
            } catch (err) {
                this.$store.commit(LODING_SPINNER_SHOW_MUTATION, false, {root: true});
                console.log(err)
            }
        },
        async reject(id) {
            this.buttonDisabled = true;
            this.$store.commit(LODING_SPINNER_SHOW_MUTATION, true, {root: true});
            try {
                await axios.request({
                    method: 'put',
                    maxBodyLength: Infinity,
                    url: `http://localhost:3000/update-user/${id}?email=${this.user.email}&userName=${this.user.firstName} ${this.user.lastName}`,
                    data: {
                        revokeReason: this.reason,
                        status: 'Rejected',
                    }
                });
                this.modalActive = false;
                this.user.enabled = false;
                this.user.revokeReason = this.reason;
                this.reason = '';
                this.user.status = 'Rejected'
                this.buttonDisabled = false;
                this.$store.commit(LODING_SPINNER_SHOW_MUTATION, false, {root: true});
            } catch (err) {
                this.buttonDisabled = false;
                this.$store.commit(LODING_SPINNER_SHOW_MUTATION, false, {root: true});
                console.log(err)
            }
        },
        showRevokeModal() {
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        },
    },
    async mounted() {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://keycloak-sit-vaps-sit.apps.nt-non-ocp.neotek.sa/admin/realms/master/users/${this.$route.params.id}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-data')).data.access_token}`,
            },
        };

        try {
            this.$store.commit(LODING_SPINNER_SHOW_MUTATION, true, {root: true});
            let response = await axios.request(config);
            this.user = response.data;
            this.$store.commit(LODING_SPINNER_SHOW_MUTATION, false, {root: true});
        } catch (err) {
            this.$store.commit(LODING_SPINNER_SHOW_MUTATION, false, {root: true});
            localStorage.removeItem('user-data');
            this.$router.push("/login")
            console.log(err)
        }

        config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://localhost:3000/view-user/${this.$route.params.id}`,
        };

        try {
            this.$store.commit(LODING_SPINNER_SHOW_MUTATION, true, {root: true});
            let response = await axios.request(config);
            if (Object.keys(response.data).length != 0) {
                this.user.revokeReason = response.data.data.revokereason;
                this.user.file1 = response.data.data.file1;
                this.user.file2 = response.data.data.file2;
                this.user.file3 = response.data.data.file3;
                this.user.status = response.data.data.status;
            }
            console.log(this.user)
            this.$store.commit(LODING_SPINNER_SHOW_MUTATION, false, {root: true});
        } catch (err) {
            this.$store.commit(LODING_SPINNER_SHOW_MUTATION, false, {root: true});
            localStorage.removeItem('user-data');
            this.$router.push("/login")
            console.log(err)
        }
    },

}
</script>
<style lang>

</style>