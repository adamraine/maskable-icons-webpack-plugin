/** @typedef {import('webpack').Compiler} Compiler */
class MaskableIcons {
  /**
   * @param {Compiler} compiler 
   */
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(MaskableIcons.name, compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: MaskableIcons.name,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        () => {
          for (const file of Object.keys(compilation.assets)) {
            if (!/manifest/.test(file)) continue;
            const contents = compilation.getAsset(file);
            let json;
            try {
              json = JSON.parse(contents.source.source());
            } catch {
              continue;
            }
            if (!Array.isArray(json.icons)) continue;
            const maskables = json.icons.map(i => ({...i, purpose: 'maskable'}));
            json.icons.push(...maskables);
            compilation.updateAsset(
              file,
              new sources.RawSource(JSON.stringify(json)),
            )
          }
        }
      )
    });
  }
}

module.exports = MaskableIcons;
