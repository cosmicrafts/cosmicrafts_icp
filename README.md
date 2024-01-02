# cosmicrafts_icp

Welcome to your new cosmicrafts_icp project and to the internet computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and to include your own code to speed up the development cycle.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with cosmicrafts_icp, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Rust Canister Development Guide](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)
- [ic-cdk](https://docs.rs/ic-cdk)
- [ic-cdk-macros](https://docs.rs/ic-cdk-macros)
- [Candid Introduction](https://internetcomputer.org/docs/current/developer-docs/backend/candid/)


## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

### lib.rs
Explanation of the Rust Code:

Struct Definitions:

User: This struct represents a user with properties like id, name, and email. You can add more fields as needed.
State: A simple struct that contains a vector of User objects. This is used to store the state of the canister, i.e., all the users.
Thread-Local Storage:

STATE: A thread-local variable that holds the State. RefCell is used to enable interior mutability, which means you can change the data inside STATE even if STATE itself is immutable.
Canister Functions:

create_user: An update function (modifies the state) that takes a User object and adds it to the users vector.
get_user: A query function (does not modify the state) that retrieves a user by their id from the users vector.
Serialization and Deserialization:

Both User and State are marked with CandidType and Deserialize, ensuring they are compatible with Candid's serialization and deserialization. This is important for storing and retrieving data from the canister's stable memory.