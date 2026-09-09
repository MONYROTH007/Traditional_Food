globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/about-BB7twdxZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e1-xCaaacAn02s1Zaexjy4naGeWbAE\"",
		"mtime": "2026-09-09T02:41:06.340Z",
		"size": 1505,
		"path": "../public/assets/about-BB7twdxZ.js"
	},
	"/assets/amok-DDUKswv7.jpg": {
		"type": "image/jpeg",
		"etag": "\"e4c8-Z6nshhWh08SqIIy6PybiGPi0Q4c\"",
		"mtime": "2026-09-09T02:41:06.341Z",
		"size": 58568,
		"path": "../public/assets/amok-DDUKswv7.jpg"
	},
	"/assets/bai-sach-chrouk-De06CVo9.jpg": {
		"type": "image/jpeg",
		"etag": "\"104e3-KzxTUCRxX7+lst1xvZGilu68DGk\"",
		"mtime": "2026-09-09T02:41:06.341Z",
		"size": 66787,
		"path": "../public/assets/bai-sach-chrouk-De06CVo9.jpg"
	},
	"/assets/SiteChrome-kru71zHm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e3-w8pTVS5qpR5lr6dRZTqC3GCDXNk\"",
		"mtime": "2026-09-09T02:41:06.340Z",
		"size": 2275,
		"path": "../public/assets/SiteChrome-kru71zHm.js"
	},
	"/assets/contact-Fw_UnoZ8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"856-rfJdzdMiD1lq+YhAuy3uy4fq7XY\"",
		"mtime": "2026-09-09T02:41:06.340Z",
		"size": 2134,
		"path": "../public/assets/contact-Fw_UnoZ8.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-09-09T02:41:06.502Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/cha-kroeung-By21ze9Y.jpg": {
		"type": "image/jpeg",
		"etag": "\"1027c-BX7Mvf/wWyuMwC0Yd0xqGl3Mu5U\"",
		"mtime": "2026-09-09T02:41:06.341Z",
		"size": 66172,
		"path": "../public/assets/cha-kroeung-By21ze9Y.jpg"
	},
	"/assets/kralan-s7HpFPXt.jpg": {
		"type": "image/jpeg",
		"etag": "\"12e70-6uL+9Z5cn/DeIpXioEARuQDJ3Gs\"",
		"mtime": "2026-09-09T02:41:06.341Z",
		"size": 77424,
		"path": "../public/assets/kralan-s7HpFPXt.jpg"
	},
	"/assets/machu-kroeung-BKfUGIql.jpg": {
		"type": "image/jpeg",
		"etag": "\"10419-43ehcJjVENSktkQowOLmI/srP+8\"",
		"mtime": "2026-09-09T02:41:06.341Z",
		"size": 66585,
		"path": "../public/assets/machu-kroeung-BKfUGIql.jpg"
	},
	"/assets/hero-battambang-BCu2xTMw.jpg": {
		"type": "image/jpeg",
		"etag": "\"51f8f-ypLVMeybBb82C0I9mqQGHzTRpiA\"",
		"mtime": "2026-09-09T02:41:06.341Z",
		"size": 335759,
		"path": "../public/assets/hero-battambang-BCu2xTMw.jpg"
	},
	"/assets/num-banh-chok-BopWg2w8.jpg": {
		"type": "image/jpeg",
		"etag": "\"12b92-xtblVlUDyf2k2/SRt0rGB54xGiE\"",
		"mtime": "2026-09-09T02:41:06.341Z",
		"size": 76690,
		"path": "../public/assets/num-banh-chok-BopWg2w8.jpg"
	},
	"/assets/index-BV1C-19o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"55335-emWDcrbzEM9KYwsOqvPTOViMM4I\"",
		"mtime": "2026-09-09T02:41:06.340Z",
		"size": 348981,
		"path": "../public/assets/index-BV1C-19o.js"
	},
	"/assets/num-krok-BipHJn_O.jpg": {
		"type": "image/jpeg",
		"etag": "\"126d3-ESqwft7sJN1ICMCmcNbZ20JcGJY\"",
		"mtime": "2026-09-09T02:41:06.342Z",
		"size": 75475,
		"path": "../public/assets/num-krok-BipHJn_O.jpg"
	},
	"/assets/routes-baVEgYGK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"761-6o3nVlGmmAGSbPoiYcrKEsfzt3g\"",
		"mtime": "2026-09-09T02:41:06.341Z",
		"size": 1889,
		"path": "../public/assets/routes-baVEgYGK.js"
	},
	"/assets/samlor-korko-DN3QR4og.jpg": {
		"type": "image/jpeg",
		"etag": "\"d48e-orMdLCCXxt22+OaNXsGpbt7ceaU\"",
		"mtime": "2026-09-09T02:41:06.342Z",
		"size": 54414,
		"path": "../public/assets/samlor-korko-DN3QR4og.jpg"
	},
	"/assets/recipes-DjvM50hJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28f2-ssHmhKN9VXo8+fYXiIPL3f+E6Zs\"",
		"mtime": "2026-09-09T02:41:06.341Z",
		"size": 10482,
		"path": "../public/assets/recipes-DjvM50hJ.js"
	},
	"/assets/prahok-ktis-vSHwpf56.jpg": {
		"type": "image/jpeg",
		"etag": "\"11ee3-1GDq3VWgngWjjWmVs2VTBAcauxE\"",
		"mtime": "2026-09-09T02:41:06.342Z",
		"size": 73443,
		"path": "../public/assets/prahok-ktis-vSHwpf56.jpg"
	},
	"/assets/recipes-Cco4xBHH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8137-7nXUmM44kNjMHHOHvtpyCUnvKiw\"",
		"mtime": "2026-09-09T02:41:06.341Z",
		"size": 33079,
		"path": "../public/assets/recipes-Cco4xBHH.js"
	},
	"/assets/styles-DoNYlnZZ.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"131da-UZ1nNtQHFoQkdJSNEIyTzcA494I\"",
		"mtime": "2026-09-09T02:41:06.342Z",
		"size": 78298,
		"path": "../public/assets/styles-DoNYlnZZ.css"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_zfqnju = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_zfqnju
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
