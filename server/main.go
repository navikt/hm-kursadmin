package main

import (
	"os"

	"github.com/navikt/hotbff"
	"github.com/navikt/hotbff/proxy"
	"github.com/navikt/hotbff/texas"
)

var (
	useMSW = os.Getenv("USE_MSW") == "true"
	idp    = texas.EntraID
)

func init() {
	if useMSW {
		idp = ""
	}
}

func main() {
	opts := &hotbff.Options{
		BasePath: "/hjelpemidler/kursadmin/",
		RootDir:  "dist",
		Proxy: proxy.Map{
			"/api/": &proxy.Options{
				Target:      os.Getenv("HM_GODKJENNINGSKURS_URL"),
				StripPrefix: false,
				IDP:         texas.EntraID,
				IDPTarget:   os.Getenv("HM_GODKJENNINGSKURS_SCOPE"),
			}},
		IDP: idp,
		EnvKeys: []string{
			"SOKNAD_URL",
		},
	}
	hotbff.Start(opts)
}
