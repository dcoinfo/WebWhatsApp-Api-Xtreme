/* eslint-disable */
    /**
     * This script contains WAPPX functions that need to be run in the context of the webpage
     */

    /**
     * Auto discovery the webpack object references of instances that contains all functions used by the WAPPX
     * functions and creates the Store object.
     */
    /**
    Repaired the function to send by id
    //OLD
    //var idUser = new window.Store.UserConstructor(id);
    //NEW
    //var idUser = new window.Store.UserConstructor(id, {intentionallyUsePrivateConstructor: true});
    Filter WhatsApp
    jid:user:553496802962
    Status:200 Exist
    window.Store.WapQuery.queryExist("5534996802962@c.us");
    Status:404 Not Exist
    window.Store.WapQuery.queryExist("553492309490@c.us");
    */
    if (!window.Store) {
        (function () {
            function getStore(modules) {
                let foundCount = 0;
                let neededObjects = [
                    {id: "Store", conditions: (module) => (module.Chat && module.Msg) ? module : null},
                    {
                        id: "MediaCollection",
                        conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processFiles !== undefined) ? module.default : null
                    },
                    {
                        id: "ChatClass",
                        conditions: (module) => (module.default && module.default.prototype && module.default.prototype.Collection !== undefined && module.default.prototype.Collection === "Chat") ? module : null
                    },
                    {id: "MediaProcess", conditions: (module) => (module.BLOB) ? module : null},
                    {id: "Wap", conditions: (module) => (module.createGroup) ? module : null},
                    {
                        id: "ServiceWorker",
                        conditions: (module) => (module.default && module.default.killServiceWorker) ? module : null
                    },
                    {id: "State", conditions: (module) => (module.STATE && module.STREAM) ? module : null},
                    {
                        id: "WapDelete",
                        conditions: (module) => (module.sendConversationDelete && module.sendConversationDelete.length == 2) ? module : null
                    },
                    {
                        id: "Conn",
                        conditions: (module) => (module.default && module.default.ref && module.default.refTTL) ? module.default : null
                    },
                    {
                        id: "WapQuery",
                        conditions: (module) => (module.queryExist) ? module : ((module.default && module.default.queryExist) ? module.default : null)
                    },
                    {id: "CryptoLib", conditions: (module) => (module.decryptE2EMedia) ? module : null},
                    {
                        id: "OpenChat",
                        conditions: (module) => (module.default && module.default.prototype && module.default.prototype.openChat) ? module.default : null
                    },
                    {
                        id: "UserConstructor",
                        conditions: (module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null
                    },
                    {
                        id: "SendTextMsgToChat",
                        conditions: (module) => (module.sendTextMsgToChat) ? module.sendTextMsgToChat : null
                    },
                    {  
                        id: "SendSeen",
                        conditions:  (module) => (module.sendSeen) ? module.sendSeen : null
                    },
                ];
                for (let idx in modules) {
                    if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                        let first = Object.values(modules[idx])[0];
                        if ((typeof first === "object") && (first.exports)) {
                            for (let idx2 in modules[idx]) {
                                let module = modules(idx2);
                                if (!module) {
                                    continue;
                                }
                                neededObjects.forEach((needObj) => {
                                    if (!needObj.conditions || needObj.foundedModule)
                                        return;
                                    let neededModule = needObj.conditions(module);
                                    if (neededModule !== null) {
                                        foundCount++;
                                        needObj.foundedModule = neededModule;
                                    }
                                });
                                if (foundCount == neededObjects.length) {
                                    break;
                                }
                            }

                            let neededStore = neededObjects.find((needObj) => needObj.id === "Store");
                            window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
                            neededObjects.splice(neededObjects.indexOf(neededStore), 1);
                            neededObjects.forEach((needObj) => {
                                if (needObj.foundedModule) {
                                    window.Store[needObj.id] = needObj.foundedModule;
                                }
                            });
                            window.Store.ChatClass.default.prototype.sendMessage = function (e) {
                                return window.Store.SendTextMsgToChat(this, ...arguments);
                            }
                            return window.Store;
                        }
                    }
                }
            }

            webpackJsonp([], {'parasite': (x, y, z) => getStore(z)}, ['parasite']);
        })();
    }

    window.WAPPX = {
        lastRead: {}
    };

    window.WAPPX._serializeRawObj = (obj) => {
        if (obj) {
            return obj.toJSON();
        }
        return {}
    };

    /**
     * Serializes a chat object
     *
     * @param rawChat Chat object
     * @returns {{}}
     */

    window.WAPPX._serializeChatObj = (obj) => {
        if (obj == undefined) {
            return null;
        }

        return Object.assign(window.WAPPX._serializeRawObj(obj), {
            kind: obj.kind,
            isGroup: obj.isGroup,
            contact: obj['contact'] ? window.WAPPX._serializeContactObj(obj['contact']) : null,
            groupMetadata: obj["groupMetadata"] ? window.WAPPX._serializeRawObj(obj["groupMetadata"]) : null,
            presence: obj["presence"] ? window.WAPPX._serializeRawObj(obj["presence"]) : null,
            msgs: null
        });
    };

    window.WAPPX._serializeContactObj = (obj) => {
        if (obj == undefined) {
            return null;
        }

        return Object.assign(window.WAPPX._serializeRawObj(obj), {
            formattedName: obj.formattedName,
            isHighLevelVerified: obj.isHighLevelVerified,
            isMe: obj.isMe,
            isMyContact: obj.isMyContact,
            isPSA: obj.isPSA,
            isUser: obj.isUser,
            isVerified: obj.isVerified,
            isWAContact: obj.isWAContact,
            profilePicThumbObj: obj.profilePicThumb ? WAPPX._serializeProfilePicThumb(obj.profilePicThumb) : {},
            statusMute: obj.statusMute,
            msgs: null
        });
    };

    window.WAPPX._serializeMessageObj = (obj) => {
        if (obj == undefined) {
            return null;
        }

        return Object.assign(window.WAPPX._serializeRawObj(obj), {
            id: obj.id._serialized,
            sender: obj["senderObj"] ? WAPPX._serializeContactObj(obj["senderObj"]) : null,
            timestamp: obj["t"],
            content: obj["body"],
            isGroupMsg: obj.isGroupMsg,
            isLink: obj.isLink,
            isMMS: obj.isMMS,
            isMedia: obj.isMedia,
            isNotification: obj.isNotification,
            isPSA: obj.isPSA,
            type: obj.type,
            chat: WAPPX._serializeChatObj(obj['chat']),
            chatId: obj.id.remote,
            quotedMsgObj: WAPPX._serializeMessageObj(obj['_quotedMsgObj']),
            mediaData: window.WAPPX._serializeRawObj(obj['mediaData'])
        });
    };

    window.WAPPX._serializeNumberStatusObj = (obj) => {
        if (obj == undefined) {
            return null;
        }

        return Object.assign({}, {
            id: obj.jid,
            status: obj.status,
            isBusiness: (obj.biz === true),
            canReceiveMessage: (obj.status === 200)
        });
    };

    window.WAPPX._serializeProfilePicThumb = (obj) => {
        if (obj == undefined) {
            return null;
        }

        return Object.assign({}, {
            eurl: obj.eurl,
            id: obj.id,
            img: obj.img,
            imgFull: obj.imgFull,
            raw: obj.raw,
            tag: obj.tag
        });
    }

    window.WAPPX.createGroup = function (name, contactsId) {
        if (!Array.isArray(contactsId)) {
            contactsId = [contactsId];
        }

        return window.Store.Wap.createGroup(name, contactsId);
    };

    window.WAPPX.leaveGroup = function(groupId) {
        groupId = typeof groupId == "string" ? groupId : groupId._serialized;
        var group = window.Store.Chat.get(groupId);
        return group.sendExit()
    };


    window.WAPPX.getAllContacts = function (done) {
        const contacts = window.Store.Contact.map((contact) => WAPPX._serializeContactObj(contact));

        if (done !== undefined) done(contacts);
        return contacts;
    };

    /**
     * Fetches all contact objects from store, filters them
     *
     * @param done Optional callback function for async execution
     * @returns {Array|*} List of contacts
     */
    window.WAPPX.getMyContacts = function (done) {
        const contacts = window.Store.Contact.filter((contact) => contact.isMyContact === true).map((contact) => WAPPX._serializeContactObj(contact));
        if (done !== undefined) done(contacts);
        return contacts;
    };

    /**
     * Fetches contact object from store by ID
     *
     * @param id ID of contact
     * @param done Optional callback function for async execution
     * @returns {T|*} Contact object
     */
    window.WAPPX.getContact = function (id, done) {
        const found = window.Store.Contact.get(id);

        if (done !== undefined) done(window.WAPPX._serializeContactObj(found))
        return window.WAPPX._serializeContactObj(found);
    };

    /**
     * Fetches all chat objects from store
     *
     * @param done Optional callback function for async execution
     * @returns {Array|*} List of chats
     */
    window.WAPPX.getAllChats = function (done) {
        const chats = window.Store.Chat.map((chat) => WAPPX._serializeChatObj(chat));

        if (done !== undefined) done(chats);
        return chats;
    };

    window.WAPPX.haveNewMsg = function (chat) {
        return chat.unreadCount > 0;
    };

    window.WAPPX.getAllChatsWithNewMsg = function (done) {
        const chats = window.Store.Chat.filter(window.WAPPX.haveNewMsg).map((chat) => WAPPX._serializeChatObj(chat));

        if (done !== undefined) done(chats);
        return chats;
    };

    /**
     * Fetches all chat IDs from store
     *
     * @param done Optional callback function for async execution
     * @returns {Array|*} List of chat id's
     */
    window.WAPPX.getAllChatIds = function (done) {
        const chatIds = window.Store.Chat.map((chat) => chat.id._serialized || chat.id);

        if (done !== undefined) done(chatIds);
        return chatIds;
    };

    /**
     * Fetches all groups objects from store
     *
     * @param done Optional callback function for async execution
     * @returns {Array|*} List of chats
     */
    window.WAPPX.getAllGroups = function (done) {
        const groups = window.Store.Chat.filter((chat) => chat.isGroup);

        if (done !== undefined) done(groups);
        return groups;
    };

    /**
     * Fetches chat object from store by ID
     *
     * @param id ID of chat
     * @param done Optional callback function for async execution
     * @returns {T|*} Chat object
     */
    window.WAPPX.getChat = function (id, done) {
        id = typeof id == "string" ? id : id._serialized;
        const found = window.Store.Chat.get(id);
        if (done !== undefined) done(found);
        return found;
    }

    window.WAPPX.getChatByName = function (name, done) {
        const found = window.Store.Chat.find((chat) => chat.name === name);
        if (done !== undefined) done(found);
        return found;
    };

    window.WAPPX.sendImageFromDatabasePicBot = function (picId, chatId, caption) {
        var chatDatabase = window.WAPPX.getChatByName('DATABASEPICBOT');
        var msgWithImg = chatDatabase.msgs.find((msg) => msg.caption == picId);
        if (msgWithImg === undefined) {
            return false;
        }
        var chatSend = window.Store.Chat.get(chatId);
        if (chatSend === undefined) {
            return false;
        }
        const oldCaption = msgWithImg.caption;
        msgWithImg.id.id = window.WAPPX.getNewId();
        msgWithImg.id.remote = chatId;
        msgWithImg.t = Math.ceil(new Date().getTime() / 1000);
        msgWithImg.to = chatId;
        if (caption !== undefined && caption !== '') {
            msgWithImg.caption = caption;
        } else {
            msgWithImg.caption = '';
        }
        msgWithImg.collection.send(msgWithImg).then(function (e) {
            msgWithImg.caption = oldCaption;
        });

        return true;
    };

    window.WAPPX.sendMessageWithThumb = function (thumb, url, title, description, chatId,done) {
        var chatSend = window.Store.Chat.get(chatId);
        if (chatSend === undefined) {
            if(done!==undefined) done(false);
            return false;
        }
        var linkPreview = {canonicalUrl: url,
            description: description,
            matchedText: url,
            title: title,
            thumbnail: thumb};
        chatSend.sendMessage(url, {linkPreview: linkPreview, mentionedJidList: [], quotedMsg: null, quotedMsgAdminGroupJid: null});
        if(done!==undefined) done(true);
        return true;
    };

    window.WAPPX.getNewId = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 20; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };

    window.WAPPX.getChatById = function (id, done) {
        let found = window.Store.Chat.get(id);
        if (found) {
            found = WAPPX._serializeChatObj(found);
        } else {
            found = false;
        }

        if (done !== undefined) done(found);
        return found;
    };


    /**
     * I return all unread messages from an asked chat and mark them as read.
     *
     * :param id: chat id
     * :type  id: string
     *
     * :param includeMe: indicates if user messages have to be included
     * :type  includeMe: boolean
     *
     * :param includeNotifications: indicates if notifications have to be included
     * :type  includeNotifications: boolean
     *
     * :param done: callback passed by selenium
     * :type  done: function
     *
     * :returns: list of unread messages from asked chat
     * :rtype: object
     */
    window.WAPPX.getUnreadMessagesInChat = function (id, includeMe, includeNotifications, done) {
        // get chat and its messages
        let chat = window.Store.Chat.get(id);
        let messages = chat.msgs._models;

        // initialize result list
        let output = [];

        // look for unread messages, newest is at the end of array
        for (let i = messages.length - 1; i >= 0; i--)
        {
            // system message: skip it
            if (i === "remove") {
                continue;
            }

            // get message
            let messageObj = messages[i];

            // found a read message: stop looking for others
            if (typeof (messageObj.__x_isUnreadType) !== "boolean" || messageObj.__x_isUnreadType === false) {
                continue;
            } else {
                messageObj.__x_isUnreadType = false;
                // process it
                let message = WAPPX.processMessageObj(messageObj,
                        includeMe,
                        includeNotifications);

                // save processed message on result list
                if (message)
                    output.push(message);
            }
        }
        // callback was passed: run it
        if (done !== undefined) done(output);
        // return result list
        return output;
    }
    ;


    /**
     * Load more messages in chat object from store by ID
     *
     * @param id ID of chat
     * @param done Optional callback function for async execution
     * @returns None
     */
    window.WAPPX.loadEarlierMessages = function (id, done) {
        const found = window.Store.Chat.get(id);
        if (done !== undefined) {
            found.loadEarlierMsgs().then(function () {
                done()
            });
        } else {
            found.loadEarlierMsgs();
        }
    };

    /**
     * Load more messages in chat object from store by ID
     *
     * @param id ID of chat
     * @param done Optional callback function for async execution
     * @returns None
     */
    window.WAPPX.loadAllEarlierMessages = function (id, done) {
        const found = window.Store.Chat.get(id);
        x = function () {
            if (!found.msgs.msgLoadState.noEarlierMsgs) {
                found.loadEarlierMsgs().then(x);
            } else if (done) {
                done();
            }
        };
        x();
    };

    window.WAPPX.asyncLoadAllEarlierMessages = function (id, done) {
        done();
        window.WAPPX.loadAllEarlierMessages(id);
    };

    window.WAPPX.areAllMessagesLoaded = function (id, done) {
        const found = window.Store.Chat.get(id);
        if (!found.msgs.msgLoadState.noEarlierMsgs) {
            if (done) done(false);
            return false
        }
        if (done) done(true);
        return true
    };

    /**
     * Load more messages in chat object from store by ID till a particular date
     *
     * @param id ID of chat
     * @param lastMessage UTC timestamp of last message to be loaded
     * @param done Optional callback function for async execution
     * @returns None
     */

    window.WAPPX.loadEarlierMessagesTillDate = function (id, lastMessage, done) {
        const found = window.Store.Chat.get(id);
        x = function () {
            if (found.msgs.models[0].t > lastMessage) {
                found.loadEarlierMsgs().then(x);
            } else {
                done();
            }
        };
        x();
    };


    /**
     * Fetches all group metadata objects from store
     *
     * @param done Optional callback function for async execution
     * @returns {Array|*} List of group metadata
     */
    window.WAPPX.getAllGroupMetadata = function (done) {
        const groupData = window.Store.GroupMetadata.map((groupData) => groupData.all);

        if (done !== undefined) done(groupData);
        return groupData;
    };

    /**
     * Fetches group metadata object from store by ID
     *
     * @param id ID of group
     * @param done Optional callback function for async execution
     * @returns {T|*} Group metadata object
     */
    window.WAPPX.getGroupMetadata = async function (id, done) {
        let output = window.Store.GroupMetadata.get(id);

        if (output !== undefined) {
            if (output.stale) {
                await output.update();
            }
        }

        if (done !== undefined) done(output);
        return output;

    };


    /**
     * Fetches group participants
     *
     * @param id ID of group
     * @returns {Promise.<*>} Yields group metadata
     * @private
     */
    window.WAPPX._getGroupParticipants = async function (id) {
        const metadata = await WAPPX.getGroupMetadata(id);
        return metadata.participants;
    };

    /**
     * Fetches IDs of group participants
     *
     * @param id ID of group
     * @param done Optional callback function for async execution
     * @returns {Promise.<Array|*>} Yields list of IDs
     */
    window.WAPPX.getGroupParticipantIDs = async function (id, done) {
        const output = (await WAPPX._getGroupParticipants(id))
                .map((participant) => participant.id);

        if (done !== undefined) done(output);
        return output;
    };

    window.WAPPX.getGroupAdmins = async function (id, done) {
        const output = (await WAPPX._getGroupParticipants(id))
                .filter((participant) => participant.isAdmin)
                .map((admin) => admin.id);

        if (done !== undefined) done(output);
        return output;
    };

    /**
     * Gets object representing the logged in user
     *
     * @returns {Array|*|$q.all}
     */
    window.WAPPX.getMe = function (done) {
        const rawMe = window.Store.Contact.get(window.Store.Conn.me);

        if (done !== undefined) done(rawMe.all);
        return rawMe.all;
    };

    window.WAPPX.isLoggedIn = function (done) {
        // Contact always exists when logged in
        const isLogged = window.Store.Contact && window.Store.Contact.checksum !== undefined;

        if (done !== undefined) done(isLogged);
        return isLogged;
    };

    window.WAPPX.processMessageObj = function (messageObj, includeMe, includeNotifications) {
        if (messageObj.isNotification) {
            if (includeNotifications)
                return WAPPX._serializeMessageObj(messageObj);
            else
                return;
            // System message
            // (i.e. "Messages you send to this chat and calls are now secured with end-to-end encryption...")
        } else if (messageObj.id.fromMe === false || includeMe) {
            return WAPPX._serializeMessageObj(messageObj);
        }
        return;
    };

    window.WAPPX.getAllMessagesInChat = function (id, includeMe, includeNotifications, done) {
        const chat = window.Store.Chat.get(id);
        let output = [];
        const messages = chat.msgs._models;
        for (const i in messages) {
            if (i === "remove") {
                continue;
            }
            const messageObj = messages[i];

            let message = WAPPX.processMessageObj(messageObj, includeMe, includeNotifications)
            if (message)
                output.push(message);
        }
        if (done !== undefined) done(output);
        return output;
    };

    window.WAPPX.getAllMessageIdsInChat = function (id, includeMe, includeNotifications, done) {
        const chat = window.Store.Chat.get(id);
        let output = [];
        const messages = chat.msgs._models;
        for (const i in messages) {
            if ((i === "remove")
                    || (!includeMe && messages[i].isMe)
                    || (!includeNotifications && messages[i].isNotification)) {
                continue;
            }
            output.push(messages[i].id._serialized);
        }
        if (done !== undefined) done(output);
        return output;
    };

    window.WAPPX.getMessageById = function (id, done) {
        let result = false;
        try {
            let msg = window.Store.Msg.get(id);
            if (msg) {
                result = WAPPX.processMessageObj(msg, true, true);
            }
        } catch (err) { }

        if (done !== undefined) {
            done(result);
        } else {
            return result;
        }
    };

    window.WAPPX.ReplyMessage = function (idMessage, message, done) {
        var messageObject = window.Store.Msg.get(idMessage);
        if (messageObject === undefined) {
            if (done !== undefined) done(false);
            return false;
        }
        messageObject = messageObject.value();

        const chat = window.Store.Chat.get(messageObject.chat.id)
        if (chat !== undefined){
            if (done !== undefined) {
                chat.sendMessage(message, null, messageObject).then(function () {
                    function sleep(ms) {
                        return new Promise(resolve => setTimeout(resolve, ms));
                    }

                    var trials = 0;

                    function check() {
                        for (let i = chat.msgs.models.length - 1; i >= 0; i--) {
                            let msg = chat.msgs.models[i];

                            if (!msg.senderObj.isMe || msg.body != message) {
                                continue;
                            }
                            done(WAPPX._serializeMessageObj(msg));
                            return True;
                        }
                        trials += 1;
                        console.log(trials);
                        if (trials > 30) {
                            done(true);
                            return;
                        }
                        sleep(500).then(check);
                    }
                    check();
                });
                return true;
            } else {
                chat.sendMessage(message, null, messageObject);
                return true;
            }
        } else {
            if (done !== undefined) done(false);
            return false;
        }
    };

    window.WAPPX.sendMessageToID = function (id, message, done) {
        try {
            //OLD
            //var idUser = new window.Store.UserConstructor(id);
            //NEW
            var idUser = new window.Store.UserConstructor(id, {intentionallyUsePrivateConstructor: true});
            // create new chat
           // return Store.Chat.find(idUser).then((chat) => {
             //   if (done !== undefined) {
               //     chat.sendMessage(message).then(function () {
                 //       done(true);
                  //  });
                   // return true;
                //} else {
                  //  chat.sendMessage(message);
                   // return true;
               // }
            window.getContact = ( id ) => {
                return Store.WapQuery.queryExist(id)
            }
            window.getContact(id).then(contact => {
                if(contact.status === 404){
                    done(true);
                }else {
                    Store.Chat.find(contact.jid).then(chat => {
                        chat.sendMessage(message);
                        return true;
                        }).catch(reject => {
                        done(true);
                    }); 
                }
              });
        } catch (e) {
            if (window.Store.Chat.length === 0)
                return false;

            firstChat = Store.Chat.models[0];
            var originalID = firstChat.id;
            firstChat.id = typeof originalID === "string" ? id : new window.Store.UserConstructor(id, {intentionallyUsePrivateConstructor: true});
            if (done !== undefined) {
                firstChat.sendMessage(message).then(function () {
                    firstChat.id = originalID;
                    done(true);
                });
                return true;
            } else {
                firstChat.sendMessage(message);
                firstChat.id = originalID;
                return true;
            }
        }
        if (done !== undefined) done(false);
        return false;
    }


    window.WAPPX.sendMessage = function (id, message, done) {
        var chat = window.Store.Chat.get(id);
        if (chat !== undefined) {
            if (done !== undefined) {
                chat.sendMessage(message).then(function () {
                    function sleep(ms) {
                        return new Promise(resolve => setTimeout(resolve, ms));
                    }

                    var trials = 0;

                    function check() {
                        for (let i = chat.msgs.models.length - 1; i >= 0; i--) {
                            let msg = chat.msgs.models[i];

                            if (!msg.senderObj.isMe || msg.body != message) {
                                continue;
                            }
                            done(WAPPX._serializeMessageObj(msg));
                            return True;
                        }
                        trials += 1;
                        console.log(trials);
                        if (trials > 30) {
                            done(true);
                            return;
                        }
                        sleep(500).then(check);
                    }
                    check();
                });
                return true;
            } else {
                chat.sendMessage(message);
                return true;
            }
        } else {
            if (done !== undefined) done(false);
            return false;
        }
    };

    window.WAPPX.sendMessage2 = function (id, message, done) {
        var chat = window.Store.Chat.get(id);
        if (chat !== undefined) {
            try {
                if (done !== undefined) {
                    chat.sendMessage(message).then(function () {
                        done(true);
                    });
                } else {
                    chat.sendMessage(message);
                }
                return true;
            } catch (error) {
                if (done !== undefined) done(false)
                return false;
            }
        }
        if (done !== undefined) done(false)
        return false;
    };


    window.WAPPX.sendSeen = function (id, done) {
        var chat = window.Store.Chat.get(id);
        if (chat !== undefined) {
            if (done !== undefined) {
                chat.sendSeen(false).then(function () {
                    done(true);
                });
                return true;
            } else {
                chat.sendSeen(false);
                return true;
            }
        }
        if (done !== undefined) done();
        return false;
    };

    function isChatMessage(message) {
        if (message.isSentByMe) {
            return false;
        }
        if (message.isNotification) {
            return false;
        }
        if (!message.isUserCreatedType) {
            return false;
        }
        return true;
    }


    window.WAPPX.getUnreadMessages = function (includeMe, includeNotifications, use_unread_count, done) {
        const chats = window.Store.Chat.models;
        let output = [];
        for (let chat in chats) {
            if (isNaN(chat)) {
                continue;
            }

            let messageGroupObj = chats[chat];
            let messageGroup = WAPPX._serializeChatObj(messageGroupObj);
            messageGroup.messages = [];

            const messages = messageGroupObj.msgs._models;
            for (let i = messages.length - 1; i >= 0; i--) {
                let messageObj = messages[i];
                if (typeof (messageObj.__x_isUnreadType) != "boolean" || messageObj.__x_isUnreadType === false) {
                    continue;
                } else {
                    messageObj.__x_isUnreadType = false;
                    let message = WAPPX.processMessageObj(messageObj, includeMe, includeNotifications);
                    if (message) {
                        messageGroup.messages.push(message);
                    }
                }
            }

            if (messageGroup.messages.length > 0) {
                output.push(messageGroup);
            } else { // no messages with isNewMsg true
                if (use_unread_count) {
                    let n = messageGroupObj.unreadCount; // will use unreadCount attribute to fetch last n messages from sender
                    for (let i = messages.length - 1; i >= 0; i--) {
                        let messageObj = messages[i];
                        if (n > 0) {
                            if (!messageObj.isSentByMe) {
                                let message = WAPPX.processMessageObj(messageObj, includeMe, includeNotifications);
                                messageGroup.messages.unshift(message);
                                n -= 1;
                            }
                        } else if (n === -1) { // chat was marked as unread so will fetch last message as unread
                            if (!messageObj.isSentByMe) {
                                let message = WAPPX.processMessageObj(messageObj, includeMe, includeNotifications);
                                messageGroup.messages.unshift(message);
                                break;
                            }
                        } else { // unreadCount = 0
                            break;
                        }
                    }
                    if (messageGroup.messages.length > 0) {
                        messageGroupObj.unreadCount = 0; // reset unread counter
                        output.push(messageGroup);
                    }
                }
            }
        }
        if (done !== undefined) {
            done(output);
        }
        return output;
    };

    window.WAPPX.getGroupOwnerID = async function (id, done) {
        const output = (await WAPPX.getGroupMetadata(id)).owner.id;
        if (done !== undefined) {
            done(output);
        }
        return output;

    };

    window.WAPPX.getCommonGroups = async function (id, done) {
        let output = [];

        groups = window.WAPPX.getAllGroups();

        for (let idx in groups) {
            try {
                participants = await window.WAPPX.getGroupParticipantIDs(groups[idx].id);
                if (participants.filter((participant) => participant == id).length) {
                    output.push(groups[idx]);
                }
            } catch (err) {
                console.log("Error in group:");
                console.log(groups[idx]);
                console.log(err);
            }
        }

        if (done !== undefined) {
            done(output);
        }
        return output;
    };


    window.WAPPX.getProfilePicSmallFromId = function(id, done) {
        window.Store.ProfilePicThumb.find(id).then(function(d) {
            if(d.img !== undefined) {
                window.WAPPX.downloadFileWithCredentials(d.img, done);
            } else {
                done(false);
            }
        }, function(e) {
            done(false);
        })
    };

    window.WAPPX.getProfilePicFromId = function(id, done) {
        window.Store.ProfilePicThumb.find(id).then(function(d) {
            if(d.imgFull !== undefined) {
                window.WAPPX.downloadFileWithCredentials(d.imgFull, done);
            } else {
                done(false);
            }
        }, function(e) {
            done(false);
        })
    };

    window.WAPPX.downloadFileWithCredentials = function (url, done) {
        let xhr = new XMLHttpRequest();


        xhr.onload = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let reader = new FileReader();
                    reader.readAsDataURL(xhr.response);
                    reader.onload = function (e) {
                        done(reader.result.substr(reader.result.indexOf(',') + 1))
                    };
                } else {
                    console.error(xhr.statusText);
                }
            } else {
                console.log(err);
                done(false);
            }
        };

        xhr.open("GET", url, true);
        xhr.withCredentials = true;
        xhr.responseType = 'blob';
        xhr.send(null);
    };


    window.WAPPX.downloadFile = function (url, done) {
        let xhr = new XMLHttpRequest();


        xhr.onload = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let reader = new FileReader();
                    reader.readAsDataURL(xhr.response);
                    reader.onload = function (e) {
                        done(reader.result.substr(reader.result.indexOf(',') + 1))
                    };
                } else {
                    console.error(xhr.statusText);
                }
            } else {
                console.log(err);
                done(false);
            }
        };

        xhr.open("GET", url, true);
        xhr.responseType = 'blob';
        xhr.send(null);
    };

    window.WAPPX.getBatteryLevel = function (done) {
        if (window.Store.Conn.plugged) {
            if (done !== undefined) {
                done(100);
            }
            return 100;
        }
        output = window.Store.Conn.battery;
        if (done !== undefined) {
            done(output);
        }
        return output;
    };

    window.WAPPX.deleteConversation = function (chatId, done) {
        let userId = new window.Store.UserConstructor(chatId, {intentionallyUsePrivateConstructor: true});
        let conversation = window.Store.Chat.get(userId);

        if(!conversation) {
            if(done !== undefined) {
                done(false);
            }
            return false;
        }

        conversation.sendDelete().then(() => {
            if (done !== undefined) {
                done(true);
            }
        }).catch(() => {
            if (done !== undefined) {
                done(false);
            }
        });

        return true;
    };

    window.WAPPX.deleteMessage = function (chatId, messageArray, revoke=false, done) {
        let userId = new window.Store.UserConstructor(chatId, {intentionallyUsePrivateConstructor: true});
        let conversation = window.Store.Chat.get(userId);

        if(!conversation) {
            if(done !== undefined) {
                done(false);
            }
            return false;
        }
        
        if (!Array.isArray(messageArray)) {
            messageArray = [messageArray];
        }

        if(revoke){
            conversation.sendRevokeMsgs(messageArray, conversation);    
        }else{
            conversation.sendDeleteMsgs(messageArray, conversation);    
        }
        

        if (done !== undefined) {
            done(true);
        }

        return true;
    };

    window.WAPPX.checkNumberStatus = function(id, done) {
        window.Store.WapQuery.queryExist(id).then((result) => {
            if(done !== undefined) {
                if(result.jid === undefined) throw 404;
                done(window.WAPPX._serializeNumberStatusObj(result));
            }
        }).catch((e) => {
            if(done !== undefined) {
                done(window.WAPPX._serializeNumberStatusObj({
                    status: e,
                    jid: id
                }));
            }
        });

        return true;
    };

    /**
     * New messages observable functions.
     */
    window.WAPPX._newMessagesQueue = [];
    window.WAPPX._newMessagesBuffer = (sessionStorage.getItem('saved_msgs') != null) ?
        JSON.parse(sessionStorage.getItem('saved_msgs')) : [];
    window.WAPPX._newMessagesDebouncer = null;
    window.WAPPX._newMessagesCallbacks = [];
    window.Store.Msg.off('add');
    sessionStorage.removeItem('saved_msgs');

    window.WAPPX._newMessagesListener = window.Store.Msg.on('add', (newMessage) => {
        if (newMessage && newMessage.__x_isUnreadType && !newMessage.isSentByMe) {
            let message = window.WAPPX.processMessageObj(newMessage, false, false);
            if (message) {
                window.WAPPX._newMessagesQueue.push(message);
                window.WAPPX._newMessagesBuffer.push(message);
            }

            // Starts debouncer time to don't call a callback for each message if more than one message arrives
            // in the same second
            if(!window.WAPPX._newMessagesDebouncer && window.WAPPX._newMessagesQueue.length > 0) {
                window.WAPPX._newMessagesDebouncer = setTimeout(() => {
                    window.WAPPX._newMessagesDebouncer = null;
                    let queuedMessages = window.WAPPX._newMessagesQueue;
                    window.WAPPX._newMessagesQueue = [];

                    let removeCallbacks = [];
                    window.WAPPX._newMessagesCallbacks.forEach(function(callbackObj) {
                        if(callbackObj.callback !== undefined) {
                            callbackObj.callback(queuedMessages);
                        }
                        if(callbackObj.rmAfterUse === true) {
                            removeCallbacks.push(callbackObj);
                        }
                    });

                    // Remove removable callbacks.
                    removeCallbacks.forEach(function(rmCallbackObj) {
                        let callbackIndex = window.WAPPX._newMessagesCallbacks.indexOf(rmCallbackObj);
                        window.WAPPX._newMessagesCallbacks.splice(callbackIndex, 1);
                    });
                }, 1000);
            }
        }
    });

    window.WAPPX._unloadInform = (event) => {
        // Save in the buffer the ungot unreaded messages
        window.WAPPX._newMessagesBuffer.forEach((message) => {
            Object.keys(message).forEach(key => message[key] === undefined ? delete message[key] : '');
        });
        sessionStorage.setItem("saved_msgs", JSON.stringify(window.WAPPX._newMessagesBuffer));

        // Inform callbacks that the page will be reloaded.
        window.WAPPX._newMessagesCallbacks.forEach(function(callbackObj) {
            if(callbackObj.callback !== undefined) {
                callbackObj.callback({status: -1, message: 'page will be reloaded, wait and register callback again.'});
            }
        });
    };

    window.addEventListener("unload", window.WAPPX._unloadInform, false);
    window.addEventListener("beforeunload", window.WAPPX._unloadInform, false);
    window.addEventListener("pageunload", window.WAPPX._unloadInform, false);

    /**
     * Registers a callback to be called when a new message arrives the WAPPX.
     * @param rmCallbackAfterUse - Boolean - Specify if the callback need to be executed only once
     * @param done - function - Callback function to be called when a new message arrives.
     * @returns {boolean}
     */
    window.WAPPX.waitNewMessages = function(rmCallbackAfterUse = true, done) {
        window.WAPPX._newMessagesCallbacks.push({callback: done, rmAfterUse: rmCallbackAfterUse});
        return true;
    };

    /**
     * Reads buffered new messages.
     * @param done - function - Callback function to be called contained the buffered messages.
     * @returns {Array}
     */
    window.WAPPX.getBufferedNewMessages = function(done) {
        let bufferedMessages = window.WAPPX._newMessagesBuffer;
        window.WAPPX._newMessagesBuffer = [];
        if(done !== undefined) {
            done(bufferedMessages);
        }
        return bufferedMessages;
    };
    /** End new messages observable functions **/

window.WAPPX.sendImage = function (imgBase64, chatid, filename, caption, done) {
    //var idUser = new window.Store.UserConstructor(chatid);
    var idUser = new window.Store.UserConstructor(chatid, {intentionallyUsePrivateConstructor: true});
    // create new chat
    return Store.Chat.find(idUser).then((chat) => {
        var mediaBlob = window.WAPPX.base64ImageToFile(imgBase64, filename);
        var mc = new Store.MediaCollection();
        mc.processFiles([mediaBlob], chat, 1).then(() => {
            var media = mc.models[0];
            media.sendToChat(chat, {caption: caption});
            if (done !== undefined) done(true);
        });
    });
}

    window.WAPPX.base64ImageToFile = function (b64Data, filename) {
        var arr = b64Data.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    };

    /**
     * Send contact card to a specific chat using the chat ids
     *
     * @param {string} to '000000000000@c.us'
     * @param {string|array} contact '111111111111@c.us' | ['222222222222@c.us', '333333333333@c.us, ... 'nnnnnnnnnnnn@c.us']
     */
    window.WAPPX.sendContact = function(to, contact) {
        if (!Array.isArray(contact)) {
            contact = [contact];
        }
        contact = contact.map((c) => {
            return window.Store.Chat.get(c).__x_contact;
        });

        if (contact.length > 1) {
            window.WAPPX.getChat(to).sendContactList(contact);
        } else if (contact.length === 1) {
            window.WAPPX.getChat(to).sendContact(contact[0]);
        }
    };

    /**
     * Create an chat ID based in a cloned one
     *
     * @param {string} chatId '000000000000@c.us'
     */
    window.WAPPX.getNewMessageId = function(chatId) {
        var newMsgId = Store.Msg.models[0].__x_id.clone();

        newMsgId.fromMe = true;
        newMsgId.id = WAPPX.getNewId().toUpperCase();
        newMsgId.remote = chatId;
        newMsgId._serialized = `${newMsgId.fromMe}_${newMsgId.remote}_${newMsgId.id}`

        return newMsgId;
    };

    /**
     * Send Customized VCard without the necessity of contact be a Whatsapp Contact
     *
     * @param {string} chatId '000000000000@c.us'
     * @param {object|array} vcard { displayName: 'Contact Name', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name;;;\nEND:VCARD' } | [{ displayName: 'Contact Name 1', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name 1;;;\nEND:VCARD' }, { displayName: 'Contact Name 2', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name 2;;;\nEND:VCARD' }]
     */
    window.WAPPX.sendVCard = function(chatId, vcard) {
        var chat = Store.Chat.get(chatId);
        var tempMsg = Object.create(Store.Msg.models.filter(msg => msg.__x_isSentByMe)[0]);
        var newId = window.WAPPX.getNewMessageId(chatId);

        var extend = {
            ack: 0,
            id: newId,
            local: !0,
            self: "out",
            t: parseInt(new Date().getTime() / 1000),
            to: chatId,
            __x_isUnreadType: !0,
        };

        if (Array.isArray(vcard)) {
            Object.assign(extend, {
                type: "multi_vcard",
                vcardList: vcard
            });

            delete extend.body;
        } else {
            Object.assign(extend, {
                type: "vcard",
                subtype: vcard.displayName,
                body: vcard.vcard
            });

            delete extend.vcardList;
        }

        Object.assign(tempMsg, extend);

        chat.addAndSendMsg(tempMsg);
    };
    /**
     * Block contact 
     * @param {string} id '000000000000@c.us'
     * @param {*} done - function - Callback function to be called when a new message arrives.
     */
    window.WAPPX.contactBlock = function(id, done){
        const contact = window.Store.Contact.get(id);
        if (contact !== undefined){
            contact.setBlock(!0);
            done(true);
            return true;
        }
        done(false);
        return false;
    }
    /**
     * unBlock contact 
     * @param {string} id '000000000000@c.us'
     * @param {*} done - function - Callback function to be called when a new message arrives.
     */
    window.WAPPX.contactUnblock = function(id, done){
        const contact = window.Store.Contact.get(id);
        if (contact !== undefined){
            contact.setBlock(!1);
            done(true);
            return true;
        }
        done(false);
        return false;
    }

    /**
     * Remove participant of Group
     * @param {*} idGroup '0000000000-00000000@g.us'
     * @param {*} idParticipant '000000000000@c.us'
     * @param {*} done - function - Callback function to be called when a new message arrives.
     */
    window.WAPPX.removeParticipantGroup = function(idGroup, idParticipant, done){
        const metaDataGroup = window.Store.GroupMetadata.get(idGroup);
        if (metaDataGroup === undefined){
            done(false); return false;
        }
        
        const participant = metaDataGroup.participants.get(idParticipant);
        if (participant === undefined){
            done(false); return false;
        }
        
        metaDataGroup.participants.removeParticipants([participant]).then((ret)=>{
            const check = metaDataGroup.participants.get(idParticipant);
            if (check === undefined){ done(true); return true; }
            done(false); return false; 
        })
        
    }


    /**
     * Promote Participant to Admin in Group
     * @param {*} idGroup '0000000000-00000000@g.us'
     * @param {*} idParticipant '000000000000@c.us'
     * @param {*} done - function - Callback function to be called when a new message arrives.
     */
    window.WAPPX.promoteParticipantAdminGroup = function(idGroup, idParticipant, done){
        const metaDataGroup = window.Store.GroupMetadata.get(idGroup);
        if (metaDataGroup === undefined){
            done(false); return false;
        }
        
        const participant = metaDataGroup.participants.get(idParticipant);
        if (participant === undefined){
            done(false); return false;
        }
        
        metaDataGroup.participants.promoteParticipants([participant]).then(()=>{
            const checkParticipant = metaDataGroup.participants.get(idParticipant);
            if (checkParticipant !== undefined){ 
                if (checkParticipant.__x_isAdmin){
                    done(true); return true;
                }
            }
            done(false); return false; 
        })
        
    }


    /**
     * Demote Admin of Group
     * @param {*} idGroup '0000000000-00000000@g.us'
     * @param {*} idParticipant '000000000000@c.us'
     * @param {*} done - function - Callback function to be called when a new message arrives.
     */
    window.WAPPX.demoteParticipantAdminGroup = function(idGroup, idParticipant, done){
        const metaDataGroup = window.Store.GroupMetadata.get(idGroup);
        if (metaDataGroup === undefined){
            done(false); return false;
        }
        
        const participant = metaDataGroup.participants.get(idParticipant);
        if (participant === undefined){
            done(false); return false;
        }
        
        metaDataGroup.participants.demoteParticipants([participant]).then(()=>{
            const checkParticipant = metaDataGroup.participants.get(idParticipant);
            if (checkParticipant !== undefined && checkParticipant.__x_isAdmin){ 
                done(false); return false;
            }
            done(true); return true; 
        })
    }
