use std::{error::Error, str::FromStr};

use cedar_policy::{
    Authorizer, Context, Decision, Entities, EntityUid, PolicySet, Request, Response, Schema,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(getter_with_clone)]
pub struct AuthorizeInput {
    pub principal: Option<String>,
    pub action: Option<String>,
    pub resource: Option<String>,
    pub context: String,
    pub policy_set: String,
    pub entities: String,
    pub schema: Option<String>,
}

#[wasm_bindgen]
impl AuthorizeInput {
    #[wasm_bindgen(constructor)]
    pub fn new(
        principal: Option<String>,
        action: Option<String>,
        resource: Option<String>,
        context: String,
        policy_set: String,
        entities: String,
        schema: Option<String>,
    ) -> Self {
        Self {
            principal: principal,
            action: action,
            resource: resource,
            context: context,
            policy_set: policy_set,
            entities: entities,
            schema: schema,
        }
    }
}

#[wasm_bindgen(getter_with_clone)]
pub struct AuthorizeOutput {
    pub response: Option<AuthorizeOutputResponse>,
    pub error: Option<String>,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(Clone)]
pub struct AuthorizeOutputResponse {
    pub decision: String,
    pub diagnostics: String,
}

impl AuthorizeOutputResponse {
    fn from_response(r: Response) -> Self {
        let decision = String::from(match r.decision() {
            Decision::Allow => "ALLOW",
            Decision::Deny => "DENY",
        });
        let diagnostics = format!("{:?}", r.diagnostics());

        Self {
            decision: decision,
            diagnostics: diagnostics,
        }
    }
}

#[wasm_bindgen]
pub fn authorize(input: AuthorizeInput) -> AuthorizeOutput {
    match authorize_helper(input) {
        Ok(r) => AuthorizeOutput {
            response: Some(AuthorizeOutputResponse::from_response(r)),
            error: None,
        },
        Err(err) => AuthorizeOutput {
            response: None,
            error: Some(err.to_string()),
        },
    }
}

fn authorize_helper(input: AuthorizeInput) -> Result<Response, Box<dyn Error>> {
    let request = build_request(
        input.principal.as_ref().map(|s| s.as_str()),
        input.action.as_ref().map(|s| s.as_str()),
        input.resource.as_ref().map(|s| s.as_str()),
        input.context.as_str(),
    )?;
    let policies = PolicySet::from_str(input.policy_set.as_str())?;
    let schema = match input.schema {
        Some(s) => Some(build_schema(s.as_str())?),
        None => None,
    };
    let entities = Entities::from_json_str(input.entities.as_str(), schema.as_ref())?;

    let authorizer = Authorizer::new();
    Ok(authorizer.is_authorized(&request, &policies, &entities))
}

fn build_request(
    p_opt: Option<&str>,
    a_opt: Option<&str>,
    r_opt: Option<&str>,
    c_str: &str,
) -> Result<Request, Box<dyn Error>> {
    let p = match p_opt {
        Some(s) => Some(build_entity_uid(s)?),
        None => None,
    };
    let a = match a_opt {
        Some(s) => Some(build_entity_uid(s)?),
        None => None,
    };
    let r = match r_opt {
        Some(s) => Some(build_entity_uid(s)?),
        None => None,
    };
    let c = Context::from_json_str(c_str, None)?;
    let r = Request::new(p, a, r, c);
    Ok(r)
}

fn build_schema(s: &str) -> Result<Schema, Box<dyn Error>> {
    let json = serde_json::from_str(s)?;
    let schema = Schema::from_json_value(json)?;
    Ok(schema)
}

fn build_entity_uid(s: &str) -> Result<EntityUid, Box<dyn Error>> {
    let entity_uid = s.parse()?;
    Ok(entity_uid)
}
