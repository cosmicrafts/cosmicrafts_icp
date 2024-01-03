use ic_cdk_macros::*;
use handlers::{on_close, on_message, on_open, AppMessage};
use ic_websocket_cdk::{
    CanisterWsCloseArguments, CanisterWsCloseResult, CanisterWsGetMessagesArguments,
    CanisterWsGetMessagesResult, CanisterWsMessageArguments, CanisterWsMessageResult,
    CanisterWsOpenArguments, CanisterWsOpenResult, WsHandlers, WsInitParams,
};
use candid::*;
use std::cell::RefCell;
use serde::{Deserialize, Serialize};

//Player Data
type UserId = String;

#[derive(CandidType, Clone, Debug, Deserialize, Serialize, Eq, PartialEq)]
struct User {
    id: UserId,
    name: String,
    email: String,
    picture: String,
    // other fields as needed
}

#[derive(Default, CandidType, Deserialize, Clone, Debug)]
struct State {
    users: Vec<User>,
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[update]
fn create_user(user: User) {
    STATE.with(|state| {
        state.borrow_mut().users.push(user);
    });
    ic_cdk::api::print("User created successfully");
}

#[update]
fn update_user(updated_user: User) {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(user) = state.users.iter_mut().find(|u| u.id == updated_user.id) {
            user.name = updated_user.name;
            user.email = updated_user.email;
            user.picture = updated_user.picture;
            ic_cdk::api::print("User updated successfully");
        } else {
            ic_cdk::api::print("User not found");
        }
    });
}

#[query]
fn get_user(id: UserId) -> Option<User> {
    STATE.with(|state| state.borrow().users.iter().find(|u| u.id == id).cloned())
}

// IC WebSockets
mod handlers;

#[init]
fn init() {
    let handlers = WsHandlers {
        on_open: Some(on_open),
        on_message: Some(on_message),
        on_close: Some(on_close),
    };

    let params = WsInitParams::new(handlers);

    ic_websocket_cdk::init(params);
}

#[post_upgrade]
fn post_upgrade() {
    init();
}

// method called by the client to open a WS connection to the canister (relayed by the WS Gateway)
#[update]
fn ws_open(args: CanisterWsOpenArguments) -> CanisterWsOpenResult {
    ic_websocket_cdk::ws_open(args)
}

// method called by the Ws Gateway when closing the IcWebSocket connection for a client
#[update]
fn ws_close(args: CanisterWsCloseArguments) -> CanisterWsCloseResult {
    ic_websocket_cdk::ws_close(args)
}

// method called by the client to send a message to the canister (relayed by the WS Gateway)
#[update]
fn ws_message(args: CanisterWsMessageArguments, msg_type: Option<AppMessage>) -> CanisterWsMessageResult {
    ic_websocket_cdk::ws_message(args, msg_type)
}

// method called by the WS Gateway to get messages for all the clients it serves
#[query]
fn ws_get_messages(args: CanisterWsGetMessagesArguments) -> CanisterWsGetMessagesResult {
    ic_websocket_cdk::ws_get_messages(args)
}


