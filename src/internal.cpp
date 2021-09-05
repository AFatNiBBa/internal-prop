
#include <node.h>

using namespace v8;

/**
 * If the given object is a proxy it returns an array of the [[Target]] and the [[Handler]].
 * If the object is not a proxy it returns 'null'.
 */
void fromProxy(const FunctionCallbackInfo<Value> &info) {
	Isolate* isolate = info.GetIsolate();
	if (!info[0]->IsProxy())
		info.GetReturnValue().Set(Null(isolate));
	else
	{
		Local<Proxy> temp = Local<Proxy>::Cast(info[0]);
		Local<Value> out[] = {
			temp->GetTarget(),
			temp->GetHandler()
		};
		info.GetReturnValue().Set(Array::New(isolate, out, 2));
	}
}

/**
 * If the given object is a promise it returns an array of the [[PromiseState]] and the [[PromiseResult]].
 * If the state is "pending" the result will be 'null'.
 * If the object is not a promise it returns 'null'.
 */
void fromPromise(const FunctionCallbackInfo<Value> &info) {
	Isolate* isolate = info.GetIsolate();
	if (!info[0]->IsPromise())
		info.GetReturnValue().Set(Null(isolate));
	else
	{
		Local<Promise> temp = Local<Promise>::Cast(info[0]);
		Promise::PromiseState state = temp->State();
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

void init(Local<Object> exports, Local<Value> module, void* context) {
	NODE_SET_METHOD(exports, "fromProxy", fromProxy);
	NODE_SET_METHOD(exports, "fromPromise", fromPromise);
}

NODE_MODULE(internal, init)
