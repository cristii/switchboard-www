# Modeling Nodes in Blender (+ simple textures)

How to model a node in Blender, give it a simple material/texture, export a `.glb`, and drop it into
the editor as a **model node**. Future device models (phone / laptop / browser) are just more `.glb`s
following these rules. For ready-made generation prompts see
[`isometric_workflow_editor_3d_model_prompts.md`](./isometric_workflow_editor_3d_model_prompts.md).

---

## 1. How model nodes load

Any node renders a GLB instead of its procedural shape when its `meta.model` is a URL:

```jsonc
{ "id": "n1", "kind": "service", "label": "API", "x": 0, "y": 0,
  "meta": { "model": "/models/server.glb" } }
```

`ModelNode` (drei `useGLTF`) loads it, **clones** it (independent per node), **centres + scales it to
the node's footprint** with its base on the ground, **clones materials** (no cache mutation), tints a
material named **`Body`** to the node colour, and applies node opacity. While it loads (or if the URL
is wrong) the node shows its **procedural catalog shape** as a Suspense fallback — so a missing model
never breaks the scene.

Put files in `public/models/` → reference as `/models/<name>.glb`. (Remote URLs work too if the deploy
allows the fetch; local is safest.)

---

## 2. Modeling rules (so it drops in cleanly)

1. **Real-world-ish scale, then let the editor fit it.** The footprint is auto-scaled to the node's
   `defaultSize` (width × depth × height) — uniform scale to the largest fitting factor — so exact
   units don't matter, but keep proportions right (a laptop is wide+flat, a phone is tall+thin).
2. **Origin at the base centre.** Set the object origin to the bottom-centre (`Object → Set Origin →
   Origin to 3D Cursor` with the cursor at the base centre). The loader rests `box.min.y` on the
   ground and centres X/Z, so a base-centred origin gives predictable placement.
3. **+Y is up, forward faces +Z** (glTF convention; Blender exports with "+Y up"). The isometric
   camera looks from `(+1,+1,+1)`, so model the "front" toward +Z/+X.
4. **Low-poly, matte.** Match the premium-minimal SaaS look: rounded bevels, few thousand tris,
   matte materials. Avoid mirror/transmission (they're heavy and off-brand).
5. **Apply transforms** before export (`Ctrl+A → All Transforms`) so scale/rotation bake in.

---

## 3. Materials & simple textures

- **Tintable part → name the material `Body`.** The editor recolours the `Body` material to the
  node's theme colour at runtime (case-insensitive match). Give accents/screens their own materials
  (e.g. `Screen`, `Trim`) so they keep their colour.
- **Keep it Principled BSDF.** glTF exports the base color, metallic, roughness, normal and emissive
  from Principled BSDF. Keep `Metallic` low and `Roughness` ~0.6–0.8 for the matte look.
- **Simple textures:** a single base-color image (and optionally roughness/normal) is plenty. UV-unwrap
  (`U → Smart UV Project`), assign the image to the Principled `Base Color`, and **pack** it
  (`File → External Data → Pack Resources`) so it embeds in the `.glb`. Prefer ≤1K textures.
- **Emissive screens:** set a small Emission on a `Screen` material for glowing displays.

---

## 4. Export

`File → Export → glTF 2.0 (.glb/.gltf)`:
- **Format:** `glb` (single binary, textures embedded).
- **Include:** Selected Objects (if exporting one), `+Y Up` on.
- **Transform:** apply modifiers.
- **Compression:** OK to leave off. *Draco* works but the loader needs the Draco decoder configured —
  start uncompressed.
- Keep the file lean (a few hundred KB ideally) — it's fetched at runtime.

Drop the `.glb` in `public/models/`, set `meta.model` on a node, and reload.

---

## 5. Checklist

- [ ] Origin at base centre; transforms applied; +Y up.
- [ ] Tintable material named `Body`; accents separate; Principled BSDF; textures packed.
- [ ] Exported `.glb` is small; placed in `public/models/`.
- [ ] Node renders, tints to the theme colour, sits on the ground at the right size, casts a shadow,
      and falls back to the procedural shape while loading.
- [ ] Looks right in **both** the light and `aws` themes and in a preview embed.

> Device models (phone/laptop/browser) follow the exact same path — model, name the tintable material
> `Body`, export, reference via `meta.model`. No code change needed to add more of them.
