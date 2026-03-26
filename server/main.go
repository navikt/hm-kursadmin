package main

import (
	"os"

	"github.com/navikt/hotbff"
	"github.com/navikt/hotbff/decorator"
	// "github.com/navikt/hotbff/proxy"
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
		DecoratorOpts: &decorator.Options{
			Context: "samarbeidspartner",
		},
		IDP: idp,
		EnvKeys: []string{
			"SOKNAD_URL",
		},
	}
	hotbff.Start(opts)
}
