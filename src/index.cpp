
#include <node.h>

using namespace v8;

/// The hidden property-filter for getting private symbols
const auto FILTER_PRIVATE_SYMBOLS = (PropertyFilter)64;

/// Shorthand for returning values
#define RETURN(info, value) { info.GetReturnValue().Set(value); return; }

/// Shorthand for setting object properties
#define SET(isolate, ctx, obj, k, v) obj->Set(ctx, String::NewFromUtf8(isolate, k).ToLocalChecked(), v)

/// <summary>
/// Gets the target and the handler of a proxy.
/// If the provided value is not a proxy it returns null
/// </summary>
/// <param name="info">The function arguments</param>
static void getProxyData(const FunctionCallbackInfo<Value>& info)
{
	auto isolate = info.GetIsolate();
	auto& value = info[0];
	if (!value->IsProxy())
		RETURN(info, Null(isolate));
	
	auto out = Object::New(isolate);
	auto ctx = isolate->GetCurrentContext();
	auto proxy = value.As<Proxy>();
	SET(isolate, ctx, out, "target", proxy->GetTarget());
	SET(isolate, ctx, out, "handler", proxy->GetHandler());
	RETURN(info, out);
}

/// <summary>
/// Gets the state and the result of a promise.
/// If the provided value is not a promise it returns null
/// </summary>
/// <param name="info">The function arguments</param>
static void getPromiseData(const FunctionCallbackInfo<Value>& info)
{
	auto isolate = info.GetIsolate();
	auto& value = info[0];
	if (!value->IsPromise())
		RETURN(info, Null(isolate));

	auto out = Object::New(isolate);
	auto ctx = isolate->GetCurrentContext();
	auto promise = value.As<Promise>();
	auto state = promise->State();
	auto result = Promise::PromiseState::kPending ? (Local<Value>)Null(isolate) : promise->Result();
	SET(isolate, ctx, out, "state", Number::New(isolate, state));
	SET(isolate, ctx, out, "result", result);
	RETURN(info, out);
}

/// <summary>
/// Gets the symbols of the private fields of an object.
/// If the provided value is not an object it returns null
/// </summary>
/// <param name="info">The function arguments</param>
static void getOwnPrivateSymbols(const FunctionCallbackInfo<Value>& info)
{
	auto isolate = info.GetIsolate();
	auto& value = info[0];
	if (!value->IsObject())
		RETURN(info, Null(isolate));

	auto obj = value.As<Object>();
	auto ctx = isolate->GetCurrentContext();
	auto out = obj->GetPropertyNames(ctx, KeyCollectionMode::kOwnOnly, FILTER_PRIVATE_SYMBOLS, IndexFilter::kSkipIndices, KeyConversionMode::kNoNumbers);
	RETURN(info, out.ToLocalChecked());
}

static void init(Local<Object> exports, Local<Value>, Local<Context>)
{
	#define EXPORT(name) NODE_SET_METHOD(exports, #name, name)

	EXPORT(getProxyData);
	EXPORT(getPromiseData);
	EXPORT(getOwnPrivateSymbols);
}

NODE_MODULE(internal, init)