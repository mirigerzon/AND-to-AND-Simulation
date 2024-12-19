let registerDbServer = new Server("100.100.100.100", new RegisterDB("registerDatabase"));
let taskDbServer = new Server("200.200.200.200", new TaskDB("todoDatabase"));