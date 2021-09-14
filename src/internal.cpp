
#include <node.h>

using namespace v8;

/**
 * If the given value is a proxy it returns an array of the [[Target]] and the [[Handler]].
 * If the value is not a proxy it returns 'null'.
 */
void fromProxy(const FunctionCallbackInfo<Value> &info)
{
	auto isolate = info.GetIsolate();
	if (!info[0]->IsProxy())
		info.GetReturnValue().Set(Null(isolate));
	else
	{
		auto temp = info[0].As<Proxy>();
		Local<Value> out[] = {
			temp->GetTarget(),
			temp->GetHandler()
		};
		info.GetReturnValue().Set(Array::New(isolate, out, 2));
	}
}

/**
 * If the given value is a promise it returns an array of the [[PromiseState]] and the [[PromiseResult]].
 * If the state is "pending" the result will be 'null'.
 * If the value is not a promise it returns 'null'.
 */
void fromPromise(const FunctionCallbackInfo<Value> &info)
{
	auto isolate = info.GetIsolate();
	if (!info[0]->IsPromise())
		info.GetReturnValue().Set(Null(isolate));
	else
	{
		auto temp = info[0].As<Promise>();
		auto state = temp->State();
		Local<Value> out[] = {
			String::NewFromUtf8(isolate, (
				state == Promise::PromiseState::kFulfilled
					? "fulfilled"
				: state == Promise::PromiseState::kPending
					? "pending"
					: "rejected"
			)).ToLocalChecked(),
			state == Promise::PromiseState::kPending
				? (Local<Value>)Null(isolate)
				: temp->Result()
		};
		info.GetReturnValue().Set(Array::New(isolate, out, 2));
	}
}

/**
 * If the given value is an object it will return its private symbols, which are the way V8 handles private fields.
 * If the value is not an object it returns 'null'.
 */
void getOwnPrivateSymbols(const FunctionCallbackInfo<Value> &info)
{
	auto isolate = info.GetIsolate();
	info.GetReturnValue().Set(
		!info[0]->IsObject()
		? (Local<Value>)Null(isolate)
		: info[0].As<Object>()->GetPropertyNames(
			isolate->GetCurrentContext(),
			KeyCollectionMode::kIncludePrototypes,	// Search on the prototype too
			(PropertyFilter)64,						// Only private properties (The number is raw because it is apparently defined only on debug mode)
			IndexFilter::kSkipIndices,				// Skip the number indices
			KeyConversionMode::kNoNumbers			// Basically ↑
		).ToLocalChecked()
	);
}

/**
 * Fills the "module.exports" object with the native functions
 */
void init(Local<Object> exports, Local<Value> module, Local<Context> context)
{
	NODE_SET_METHOD(exports, "fromProxy", fromProxy);
	NODE_SET_METHOD(exports, "fromPromise", fromPromise);
	NODE_SET_METHOD(exports, "getOwnPrivateSymbols", getOwnPrivateSymbols);
}

NODE_MODULE(internal, init)